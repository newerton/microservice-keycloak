function getAccess(e, r, t) {
  if (!r.realm) return !1;
  var a = e.user?.realm_access;
  return !(!a || !(a = a[r.realm.realm])) && a.indexOf(t) >= 0;
}
function getAccessObject(e, r) {
  return {
    get createRealm() {
      return e.user?.createRealm;
    },
    get queryUsers() {
      return getAccess(e, r, 'query-users') || this.viewUsers;
    },
    get queryGroups() {
      return getAccess(e, r, 'query-groups') || this.viewUsers;
    },
    get queryClients() {
      return getAccess(e, r, 'query-clients') || this.viewClients;
    },
    get viewRealm() {
      return (
        getAccess(e, r, 'view-realm') ||
        getAccess(e, r, 'manage-realm') ||
        this.manageRealm
      );
    },
    get viewClients() {
      return (
        getAccess(e, r, 'view-clients') ||
        getAccess(e, r, 'manage-clients') ||
        this.manageClients
      );
    },
    get viewUsers() {
      return (
        getAccess(e, r, 'view-users') ||
        getAccess(e, r, 'manage-users') ||
        this.manageClients
      );
    },
    get viewEvents() {
      return (
        getAccess(e, r, 'view-events') ||
        getAccess(e, r, 'manage-events') ||
        this.manageClients
      );
    },
    get viewIdentityProviders() {
      return (
        getAccess(e, r, 'view-identity-providers') ||
        getAccess(e, r, 'manage-identity-providers') ||
        this.manageIdentityProviders
      );
    },
    get viewAuthorization() {
      return getAccess(e, r, 'view-authorization') || this.manageAuthorization;
    },
    get manageRealm() {
      return getAccess(e, r, 'manage-realm');
    },
    get manageClients() {
      return getAccess(e, r, 'manage-clients');
    },
    get manageUsers() {
      return getAccess(e, r, 'manage-users');
    },
    get manageEvents() {
      return getAccess(e, r, 'manage-events');
    },
    get manageIdentityProviders() {
      return getAccess(e, r, 'manage-identity-providers');
    },
    get manageAuthorization() {
      return getAccess(e, r, 'manage-authorization');
    },
    get impersonation() {
      return getAccess(e, r, 'impersonation');
    },
  };
}
function genericRealmUpdate(e, _r, t, a, n, _l, i, _o, s, _c) {
  (e.realm = angular.copy(a)),
    (e.serverInfo = n),
    (e.registrationAllowed = e.realm.registrationAllowed);
  var u = angular.copy(e.realm);
  (e.changed = !1),
    e.$watch(
      'realm',
      () => {
        angular.equals(e.realm, u) || (e.changed = !0);
      },
      !0,
    ),
    (e.save = () => {
      var r = angular.copy(e.realm);
      console.log('updating realm...'),
        (e.changed = !1),
        console.log(`oldCopy.realm - ${u.realm}`),
        t.update({ id: u.realm }, r, () => {
          i.reload(),
            s.success('Your changes have been saved to the realm.'),
            (e.registrationAllowed = e.realm.registrationAllowed);
        });
    }),
    (e.reset = () => {
      (e.realm = angular.copy(u)), (e.changed = !1);
    }),
    (e.cancel = () => {
      i.reload();
    });
}
module.controller('GlobalCtrl', (e, _r, t, a, n, _l, i, o) => {
  (e.authUrl = authUrl),
    (e.resourceUrl = resourceUrl),
    (e.auth = t),
    (e.serverInfo = i.get()),
    (e.access = getAccessObject(t, a)),
    e.$watch(
      () => n.path(),
      () => {
        (e.fragment = n.path()), (e.path = n.path().substring(1).split('/'));
      },
    ),
    e.$watch(
      () => a.realm,
      () => {
        null !== a.realm &&
          currentRealm !== a.realm.id &&
          ((currentRealm = a.realm.id),
          translateProvider.translations(locale, resourceBundle),
          o.get({ id: a.realm.realm, locale: locale }, (e) => {
            translateProvider.translations(locale, e.toJSON());
          }));
      },
    );
}),
  module.controller('HomeCtrl', (e, r, t, a) => {
    e.query(null, (e) => {
      var n;
      if (
        (1 === e.length
          ? (n = e[0])
          : 2 === e.length &&
            (e[0].realm === r.user.realm
              ? (n = e[1])
              : e[1].realm === r.user.realm && (n = e[0])),
        n)
      ) {
        (t.realms = e), (t.realm = n);
        var l = getAccessObject(r, t);
        l.viewRealm || l.manageRealm
          ? a.url(`/realms/${n.realm}`)
          : l.queryClients
            ? a.url(`/realms/${n.realm}/clients`)
            : l.viewIdentityProviders
              ? a.url(`/realms/${n.realm}/identity-provider-settings`)
              : l.queryUsers
                ? a.url(`/realms/${n.realm}/users`)
                : l.queryGroups
                  ? a.url(`/realms/${n.realm}/groups`)
                  : l.viewEvents && a.url(`/realms/${n.realm}/events`);
      } else a.url('/realms');
    });
  }),
  module.controller('RealmTabCtrl', (e, r, t, a, n, l) => {
    r.removeRealm = () => {
      e.confirmDelete(t.realm.realm, 'realm', () => {
        a.remove({ id: t.realm.realm }, () => {
          (t.realms = a.query()),
            n.success('The realm has been deleted.'),
            l.url('/');
        });
      });
    };
  }),
  module.controller('ServerInfoCtrl', (e, r) => {
    r.reload(),
      (e.serverInfo = r.get()),
      e.$watch(e.serverInfo, () => {
        for (var r in ((e.providers = []), e.serverInfo.providers)) {
          var t = angular.copy(e.serverInfo.providers[r]);
          (t.name = r), e.providers.push(t);
        }
      }),
      (e.serverInfoReload = () => {
        r.reload();
      });
  }),
  module.controller('RealmListCtrl', (e, r, t) => {
    (e.realms = r.query()), (t.realms = e.realms);
  }),
  module.controller('RealmDropdownCtrl', (e, _r, t, _a, n) => {
    (e.current = t),
      (e.changeRealm = (e) => {
        n.url(`/realms/${e}`);
      });
  }),
  module.controller('RealmCreateCtrl', (e, r, t, _a, _n, l, i, _o, s, c, u) => {
    console.log('RealmCreateCtrl'),
      (r.realm = null),
      (e.realm = { enabled: !0 }),
      (e.changed = !1),
      (e.files = []);
    var m = angular.copy(e.realm);
    (e.importFile = (r) => {
      (e.realm = angular.copy(JSON.parse(r))), (e.importing = !0);
    }),
      (e.viewImportDetails = () => {
        u.open({
          templateUrl: `${resourceUrl}/partials/modal/view-object.html`,
          controller: 'ObjectModalCtrl',
          resolve: { object: () => e.realm },
        });
      }),
      e.$watch(
        'realm',
        () => {
          angular.equals(e.realm, m) || (e.changed = !0);
        },
        !0,
      ),
      e.$watch(
        'realm.realm',
        () => {
          e.realm.id = e.realm.realm;
        },
        !0,
      ),
      (e.save = () => {
        var r = angular.copy(e.realm);
        t.create(r, () => {
          s.success('The realm has been created.'),
            c.refreshPermissions(() => {
              e.$apply(() => {
                l.url(`/realms/${r.realm}`);
              });
            });
        });
      }),
      (e.cancel = () => {
        l.url('/');
      }),
      (e.reset = () => {
        i.reload();
      });
  }),
  module.controller('ObjectModalCtrl', (e, r) => {
    e.object = r;
  }),
  module.controller('RealmDetailCtrl', (e, r, t, a, n, _l, i, o, _s, c, u) => {
    if (
      ((e.createRealm = !a.realm),
      (e.serverInfo = n),
      (e.realmName = a.realm),
      (e.disableRename = a.realm === masterRealm),
      (e.authServerUrl = authServerUrl),
      null == r.realm || r.realm.realm !== a.realm)
    )
      for (var m = 0; m < r.realms.length; m++)
        if (a.realm === r.realms[m].realm) {
          r.realm = r.realms[m];
          break;
        }
    for (m = 0; m < r.realms.length; m++)
      r.realms[m].realm === a.realm && (r.realm = r.realms[m]);
    e.realm = angular.copy(a);
    var d = angular.copy(e.realm);
    (e.changed = e.create),
      e.$watch(
        'realm',
        () => {
          angular.equals(e.realm, d) || (e.changed = !0);
        },
        !0,
      ),
      e.$watch(
        'realmName',
        () => {
          angular.equals(e.realmName, d.realm) || (e.changed = !0);
        },
        !0,
      ),
      (e.save = () => {
        var a = angular.copy(e.realm);
        (a.realm = e.realmName), (e.changed = !1);
        var n = !angular.equals(e.realmName, d.realm),
          l = d.realm;
        t.update({ id: d.realm }, a, () => {
          var s = t.query(() => {
            r.realms = s;
            for (var t = 0; t < r.realms.length; t++)
              r.realms[t].realm === a.realm &&
                ((r.realm = r.realms[t]), (d = angular.copy(e.realm)));
          });
          if (n)
            if (
              (console.debug(u),
              console.debug(u.authz.tokenParsed.iss),
              u.authz.tokenParsed.iss.endsWith(masterRealm))
            )
              u.refreshPermissions(() => {
                u.refreshPermissions(() => {
                  c.success('Your changes have been saved to the realm.'),
                    e.$apply(() => {
                      i.url(`/realms/${a.realm}`);
                    });
                });
              });
            else {
              delete u.authz.token, delete u.authz.refreshToken;
              var m = o.location.href
                .replace(`/${l}/`, `/${a.realm}/`)
                .replace(`/realms/${l}`, `/realms/${a.realm}`);
              window.location.replace(m);
            }
          else
            i.url(`/realms/${a.realm}`),
              c.success('Your changes have been saved to the realm.');
        });
      }),
      (e.reset = () => {
        (e.realm = angular.copy(d)), (e.changed = !1);
      }),
      (e.cancel = () => {
        window.history.back();
      });
  }),
  module.controller('DefenseHeadersCtrl', (e, r, t, a, n, l, i, o, s) => {
    genericRealmUpdate(
      e,
      r,
      t,
      a,
      n,
      l,
      i,
      o,
      s,
      `/realms/${a.realm}/defense/headers`,
    );
  }),
  module.controller('RealmLoginSettingsCtrl', (e, r, t, a, n, l, i, o, s) => {
    e.$watch('realm.loginWithEmailAllowed', () => {
      e.realm.loginWithEmailAllowed && (e.realm.duplicateEmailsAllowed = !1);
    }),
      genericRealmUpdate(
        e,
        r,
        t,
        a,
        n,
        l,
        i,
        o,
        s,
        `/realms/${a.realm}/login-settings`,
      );
  }),
  module.controller('RealmOtpPolicyCtrl', (e, r, t, a, n, l, i, o, s) => {
    (e.optionsDigits = [6, 8]),
      genericRealmUpdate(
        e,
        r,
        t,
        a,
        n,
        l,
        i,
        o,
        s,
        `/realms/${a.realm}/authentication/otp-policy`,
      );
  }),
  module.controller(
    'RealmWebAuthnPolicyCtrl',
    (e, r, t, a, n, l, i, o, s, c) => {
      (e.deleteAcceptableAaguid = (r) => {
        e.realm.webAuthnPolicyAcceptableAaguids.splice(r, 1);
      }),
        (e.addAcceptableAaguid = () => {
          e.realm.webAuthnPolicyAcceptableAaguids.push(e.newAcceptableAaguid),
            (e.newAcceptableAaguid = '');
        }),
        (e.redirectIfWebAuthnDisabled = () => {
          n.featureEnabled('WEB_AUTHN') ||
            o.url(`/realms/${e.realm.realm}/authentication`);
        }),
        genericRealmUpdate(
          e,
          r,
          t,
          a,
          n,
          l,
          i,
          s,
          c,
          `/realms/${a.realm}/authentication/webauthn-policy`,
        );
    },
  ),
  module.controller(
    'RealmWebAuthnPasswordlessPolicyCtrl',
    (e, r, t, a, n, l, i, o, s, c) => {
      (e.deleteAcceptableAaguid = (r) => {
        e.realm.webAuthnPolicyPasswordlessAcceptableAaguids.splice(r, 1);
      }),
        (e.addAcceptableAaguid = () => {
          e.realm.webAuthnPolicyPasswordlessAcceptableAaguids.push(
            e.newAcceptableAaguid,
          ),
            (e.newAcceptableAaguid = '');
        }),
        (e.redirectIfWebAuthnDisabled = () => {
          n.featureEnabled('WEB_AUTHN') ||
            o.url(`/realms/${e.realm.realm}/authentication`);
        }),
        genericRealmUpdate(
          e,
          r,
          t,
          a,
          n,
          l,
          i,
          s,
          c,
          `/realms/${a.realm}/authentication/webauthn-policy-passwordless`,
        );
    },
  ),
  module.controller('RealmCibaPolicyCtrl', (e, r, t, a, n, l, i, _o, s, c) => {
    genericRealmUpdate(
      e,
      r,
      t,
      a,
      n,
      l,
      i,
      s,
      c,
      `/realms/${a.realm}/authentication/ciba-policy`,
    );
  }),
  module.controller('RealmThemeCtrl', (e, r, t, a, n, l, i, o, s) => {
    function c(e, r) {
      r = r || 'base';
      for (var t = 0; t < n.themes[e].length; t++)
        if (n.themes[e][t].name === r) return n.themes[e][t].locales || [];
      return [];
    }
    function u() {
      if (e.realm.internationalizationEnabled) {
        for (
          var r = c('account', e.realm.accountTheme),
            t = c('login', e.realm.loginTheme),
            a = c('email', e.realm.emailTheme),
            n = [],
            l = 0;
          l < r.length;
          l++
        ) {
          var i = r[l];
          t.indexOf(i) >= 0 && a.indexOf(i) >= 0 && n.push(i);
        }
        if (((e.supportedLocalesOptions.tags = n), e.realm.supportedLocales))
          for (l = 0; l < e.realm.supportedLocales.length; l++)
            -1 === n.indexOf(e.realm.supportedLocales[l]) &&
              (e.realm.supportedLocales = n);
        else e.realm.supportedLocales = n;
        (e.realm.defaultLocale && -1 !== n.indexOf(e.realm.defaultLocale)) ||
          (e.realm.defaultLocale = 'en');
      }
    }
    genericRealmUpdate(
      e,
      r,
      t,
      a,
      n,
      l,
      i,
      o,
      s,
      `/realms/${a.realm}/theme-settings`,
    ),
      (e.supportedLocalesOptions = { multiple: !0, simple_tags: !0, tags: [] }),
      u(),
      e.$watch('realm.loginTheme', u),
      e.$watch('realm.accountTheme', u),
      e.$watch('realm.emailTheme', u),
      e.$watch('realm.internationalizationEnabled', u);
  }),
  module.controller(
    'RealmLocalizationCtrl',
    (e, _r, t, _a, n, _l, i, o, s, c, u, m, d) => {
      (e.realm = n),
        (e.realmSpecificLocales = s),
        (e.newLocale = null),
        (e.selectedRealmSpecificLocales = null),
        (e.localizationTexts = null),
        (e.createLocale = () => {
          e.newLocale
            ? (e.realmSpecificLocales.push(e.newLocale),
              (e.selectedRealmSpecificLocales = e.newLocale),
              (e.newLocale = null),
              t.url(
                `/create/localization/${n.realm}/${e.selectedRealmSpecificLocales}`,
              ))
            : i.error(d.instant('missing-locale'));
        }),
        e.$watch(
          () => e.selectedRealmSpecificLocales,
          () => {
            null != e.selectedRealmSpecificLocales &&
              e.updateRealmSpecificLocalizationTexts();
          },
        ),
        (e.updateRealmSpecificLocales = () => {
          o.get({ id: n.realm }, (r) => {
            e.realmSpecificLocales = r;
          });
        }),
        (e.updateRealmSpecificLocalizationTexts = () => {
          c.get(
            { id: n.realm, locale: e.selectedRealmSpecificLocales },
            (r) => {
              e.localizationTexts = r;
            },
          );
        }),
        (e.removeLocalizationText = (r) => {
          m.confirmDelete(r, 'localization text', () => {
            u.remove(
              {
                realm: n.realm,
                locale: e.selectedRealmSpecificLocales,
                key: r,
              },
              () => {
                e.updateRealmSpecificLocalizationTexts(),
                  i.success(d.instant('localization-text.remove.success'));
              },
            );
          });
        });
    },
  ),
  module.controller(
    'RealmLocalizationUploadCtrl',
    (e, _r, _t, a, _n, _l, _i, _o, s, c, u) => {
      (e.realm = a),
        (e.locale = null),
        (e.files = []),
        (e.onFileSelect = (r) => {
          e.files = r;
        }),
        (e.reset = () => {
          (e.locale = null), (e.files = null);
        }),
        (e.save = () => {
          if (e.files && 0 !== e.files.length)
            for (var r = 0; r < e.files.length; r++) {
              var t = e.files[r];
              e.upload = c
                .upload({
                  url: `${authUrl}/admin/realms/${a.realm}/localization/${e.locale}`,
                  file: t,
                })
                .then((_r) => {
                  e.reset(),
                    s.success(u.instant('localization-file.upload.success'));
                })
                .catch(() => {
                  s.error(u.instant('localization-file.upload.error'));
                });
            }
          else s.error(u.instant('missing-file'));
        });
    },
  ),
  module.controller(
    'RealmLocalizationDetailCtrl',
    (e, _r, t, _a, n, l, i, o, s, c, u) => {
      (e.realm = n),
        (e.locale = i),
        (e.key = o),
        (e.value = c ? c.content : null),
        (e.create = !o),
        (e.save = () => {
          e.create
            ? s.save(
                { realm: n.realm, locale: e.locale, key: e.key },
                e.value,
                (_e, _r) => {
                  t.url(`/realms/${n.realm}/localization`),
                    l.success(u.instant('localization-text.create.success'));
                },
              )
            : s.save(
                { realm: n.realm, locale: e.locale, key: e.key },
                e.value,
                (_e, _r) => {
                  t.url(`/realms/${n.realm}/localization`),
                    l.success(u.instant('localization-text.update.success'));
                },
              );
        }),
        (e.cancel = () => {
          t.url(`/realms/${n.realm}/localization`);
        });
    },
  ),
  module.controller('RealmCacheCtrl', (e, r, t, a, n, l) => {
    (e.realm = angular.copy(r)),
      (e.clearUserCache = () => {
        t.save({ realm: r.realm }, () => {
          l.success('User cache cleared');
        });
      }),
      (e.clearRealmCache = () => {
        a.save({ realm: r.realm }, () => {
          l.success('Realm cache cleared');
        });
      }),
      (e.clearKeysCache = () => {
        n.save({ realm: r.realm }, () => {
          l.success('Public keys cache cleared');
        });
      });
  }),
  module.controller(
    'RealmPasswordPolicyCtrl',
    (e, r, t, _a, _n, l, _i, o, s) => {
      var c = (e) => {
        var r = [];
        if (!e || 0 === e.length) return r;
        for (var t = e.split(' and '), a = 0; a < t.length; a++) {
          var n,
            l,
            i = t[a];
          -1 === i.indexOf('(')
            ? ((n = i.trim()), (l = null))
            : ((n = i.substring(0, i.indexOf('('))),
              (l = i.substring(i.indexOf('(') + 1, i.lastIndexOf(')')).trim()));
          for (var o = 0; o < s.passwordPolicies.length; o++)
            if (s.passwordPolicies[o].id === n) {
              var c = JSON.parse(JSON.stringify(s.passwordPolicies[o]));
              (c.value = (l && l) || c.defaultValue), r.push(c);
            }
        }
        return r;
      };
      (e.realm = t),
        (e.serverInfo = s),
        (e.changed = !1),
        console.log(JSON.stringify(c(t.passwordPolicy))),
        (e.policy = c(t.passwordPolicy));
      var u = angular.copy(e.policy);
      e.$watch(
        'policy',
        () => {
          e.changed = !angular.equals(e.policy, u);
        },
        !0,
      ),
        (e.addPolicy = (r) => {
          (r.value = r.defaultValue),
            e.policy || (e.policy = []),
            e.policy.push(r);
        }),
        (e.removePolicy = (r) => {
          e.policy.splice(r, 1);
        }),
        (e.save = () => {
          (e.realm.passwordPolicy = ((e) => {
            if (!e || 0 === e.length) return '';
            for (var r = '', t = 0; t < e.length; t++)
              (r += `${e[t].id}(${e[t].value})`),
                t !== e.length - 1 && (r += ' and ');
            return r;
          })(e.policy)),
            console.log(e.realm.passwordPolicy),
            r.update(e.realm, () => {
              l.reload(),
                o.success('Your changes have been saved to the realm.');
            });
        }),
        (e.reset = () => {
          l.reload();
        });
    },
  ),
  module.controller(
    'RealmDefaultRolesCtrl',
    (e, r, t, a, n, l, i, o, s, c, u) => {
      console.log('RealmDefaultRolesCtrl'),
        (e.realm = t),
        (e.availableRealmRoles = angular.copy(a)),
        (e.selectedRealmRoles = []),
        (e.selectedRealmDefRoles = []),
        (e.availableClientRoles = []),
        (e.selectedClientRoles = []),
        (e.selectedClientDefRoles = []);
      for (var m = 0; m < e.availableRealmRoles.length; m++)
        if (e.availableRealmRoles[m].id === t.defaultRole.id) {
          var d = e.availableRealmRoles[m],
            f = e.availableRealmRoles.indexOf(d);
          e.availableRealmRoles.splice(f, 1);
          break;
        }
      (e.realmMappings = o.query(
        { realm: t.realm, role: t.defaultRole.id },
        () => {
          for (var r = 0; r < e.realmMappings.length; r++)
            for (
              var t = e.realmMappings[r], a = 0;
              a < e.availableRealmRoles.length;
              a++
            ) {
              var n = e.availableRealmRoles[a];
              if (n.id === t.id) {
                var l = e.availableRealmRoles.indexOf(n);
                if (-1 !== l) {
                  e.availableRealmRoles.splice(l, 1);
                  break;
                }
              }
            }
        },
      )),
        (e.addRealmDefaultRole = () => {
          (e.selectedRealmRolesToAdd = JSON.parse(`[${e.selectedRealmRoles}]`)),
            u
              .post(
                `${authUrl}/admin/realms/${t.realm}/roles-by-id/${t.defaultRole.id}/composites`,
                e.selectedRealmRolesToAdd,
              )
              .then(() => {
                for (var r = 0; r < e.selectedRealmRolesToAdd.length; r++) {
                  var t = e.selectedRealmRolesToAdd[r],
                    a = c.findIndexById(e.availableRealmRoles, t.id);
                  a > -1 &&
                    (e.availableRealmRoles.splice(a, 1),
                    e.realmMappings.push(t));
                }
                (e.selectedRealmRoles = []),
                  (e.selectedRealmRolesToAdd = []),
                  n.success('Default roles updated.');
              });
        }),
        (e.deleteRealmDefaultRole = () => {
          (e.selectedClientRolesToRemove = JSON.parse(
            `[${e.selectedRealmDefRoles}]`,
          )),
            u
              .delete(
                `${authUrl}/admin/realms/${t.realm}/roles-by-id/${t.defaultRole.id}/composites`,
                {
                  data: e.selectedClientRolesToRemove,
                  headers: { 'content-type': 'application/json' },
                },
              )
              .then(() => {
                for (var r = 0; r < e.selectedClientRolesToRemove.length; r++) {
                  var t = e.selectedClientRolesToRemove[r],
                    a = c.findIndexById(e.realmMappings, t.id);
                  a > -1 &&
                    (e.realmMappings.splice(a, 1),
                    e.availableRealmRoles.push(t));
                }
                (e.selectedRealmDefRoles = []),
                  (e.selectedClientRolesToRemove = []),
                  n.success('Default roles updated.');
              });
        }),
        (e.changeClient = (r) => {
          r?.id
            ? ((e.selectedClient = r),
              (e.selectedClientRoles = []),
              (e.selectedClientDefRoles = []),
              e.selectedClient
                ? (e.availableClientRoles = l.query(
                    { realm: t.realm, client: r.id },
                    () => {
                      e.clientMappings = s.query(
                        {
                          realm: t.realm,
                          role: t.defaultRole.id,
                          client: r.id,
                        },
                        () => {
                          for (var r = 0; r < e.clientMappings.length; r++)
                            for (
                              var t = e.clientMappings[r], a = 0;
                              a < e.availableClientRoles.length;
                              a++
                            ) {
                              var n = e.availableClientRoles[a];
                              if (n.id === t.id) {
                                var l = e.availableClientRoles.indexOf(n);
                                if (-1 !== l) {
                                  e.availableClientRoles.splice(l, 1);
                                  break;
                                }
                              }
                            }
                        },
                      );
                      for (var a = 0; a < e.availableClientRoles.length; a++)
                        if (e.availableClientRoles[a] === t.defaultRole.id) {
                          var n = e.availableClientRoles[a],
                            l = e.availableClientRoles.indexof(n);
                          e.availableClientRoles.splice(l, 1);
                          break;
                        }
                    },
                  ))
                : (e.availableClientRoles = null))
            : (e.selectedClient = null);
        }),
        (e.addClientDefaultRole = () => {
          (e.selectedClientRolesToAdd = JSON.parse(
            `[${e.selectedClientRoles}]`,
          )),
            u
              .post(
                `${authUrl}/admin/realms/${t.realm}/roles-by-id/${t.defaultRole.id}/composites`,
                e.selectedClientRolesToAdd,
              )
              .then(() => {
                for (var r = 0; r < e.selectedClientRolesToAdd.length; r++) {
                  var t = e.selectedClientRolesToAdd[r],
                    a = c.findIndexById(e.availableClientRoles, t.id);
                  a > -1 &&
                    (e.availableClientRoles.splice(a, 1),
                    e.clientMappings.push(t));
                }
                (e.selectedClientRoles = []),
                  (e.selectedClientRolesToAdd = []),
                  n.success('Default roles updated.');
              });
        }),
        (e.rmClientDefaultRole = () => {
          (e.selectedClientRolesToRemove = JSON.parse(
            `[${e.selectedClientDefRoles}]`,
          )),
            u
              .delete(
                `${authUrl}/admin/realms/${t.realm}/roles-by-id/${t.defaultRole.id}/composites`,
                {
                  data: e.selectedClientRolesToRemove,
                  headers: { 'content-type': 'application/json' },
                },
              )
              .then(() => {
                for (var r = 0; r < e.selectedClientRolesToRemove.length; r++) {
                  var t = e.selectedClientRolesToRemove[r],
                    a = c.findIndexById(e.clientMappings, t.id);
                  a > -1 &&
                    (e.clientMappings.splice(a, 1),
                    e.availableClientRoles.push(t));
                }
                (e.selectedClientDefRoles = []),
                  (e.selectedClientRolesToRemove = []),
                  n.success('Default roles updated.');
              });
        }),
        clientSelectControl(e, r.current.params.realm, i);
    },
  ),
  module.controller('IdentityProviderTabCtrl', (e, r, t, a, n) => {
    r.removeIdentityProvider = () => {
      e.confirmDelete(r.identityProvider.alias, 'provider', () => {
        r.identityProvider.$remove(
          { realm: t.realm.realm, alias: r.identityProvider.alias },
          () => {
            n.url(`/realms/${t.realm.realm}/identity-provider-settings`),
              a.success('The identity provider has been deleted.');
          },
        );
      });
    };
  }),
  module.controller(
    'RealmIdentityProviderCtrl',
    (e, _r, t, a, n, l, i, o, s, c, u, m, d, f) => {
      if (
        ((e.realm = angular.copy(l)),
        (e.initSamlProvider = () => {
          (e.nameIdFormats = [
            {
              format: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
              name: 'Persistent',
            },
            {
              format: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
              name: 'Transient',
            },
            {
              format: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
              name: 'Email',
            },
            {
              format: 'urn:oasis:names:tc:SAML:2.0:nameid-format:kerberos',
              name: 'Kerberos',
            },
            {
              format:
                'urn:oasis:names:tc:SAML:1.1:nameid-format:X509SubjectName',
              name: 'X.509 Subject Name',
            },
            {
              format:
                'urn:oasis:names:tc:SAML:1.1:nameid-format:WindowsDomainQualifiedName',
              name: 'Windows Domain Qualified Name',
            },
            {
              format: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
              name: 'Unspecified',
            },
          ]),
            (e.signatureAlgorithms = [
              'RSA_SHA1',
              'RSA_SHA256',
              'RSA_SHA256_MGF1',
              'RSA_SHA512',
              'RSA_SHA512_MGF1',
              'DSA_SHA1',
            ]),
            (e.xmlKeyNameTranformers = ['NONE', 'KEY_ID', 'CERT_SUBJECT']),
            (e.principalTypes = [
              { type: 'SUBJECT', name: 'Subject NameID' },
              { type: 'ATTRIBUTE', name: 'Attribute [Name]' },
              { type: 'FRIENDLY_ATTRIBUTE', name: 'Attribute [Friendly Name]' },
            ]),
            i?.alias ||
              ((e.identityProvider.config.nameIDPolicyFormat =
                e.nameIdFormats[0].format),
              (e.identityProvider.config.principalType =
                e.principalTypes[0].type),
              (e.identityProvider.config.signatureAlgorithm =
                e.signatureAlgorithms[1]),
              (e.identityProvider.config.xmlSigKeyInfoKeyNameTransformer =
                e.xmlKeyNameTranformers[1]),
              (e.identityProvider.config.allowCreate = 'true')),
            (e.identityProvider.config.entityId =
              e.identityProvider.config.entityId ||
              `${authUrl}/realms/${l.realm}`);
        }),
        (e.hidePassword = !0),
        (e.fromUrl = { data: '' }),
        i?.alias)
      )
        for (var p in ((e.identityProvider = angular.copy(i)),
        (e.newIdentityProvider = !1),
        c.identityProviders)) {
          var v = c.identityProviders[p];
          v.id === i.providerId && (e.provider = v);
        }
      else
        (e.identityProvider = {}),
          (e.identityProvider.config = {}),
          (e.identityProvider.alias = o.id),
          (e.identityProvider.providerId = o.id),
          (e.identityProvider.enabled = !0),
          (e.identityProvider.authenticateByDefault = !1),
          (e.identityProvider.firstBrokerLoginFlowAlias = 'first broker login'),
          (e.identityProvider.config.useJwksUrl = 'true'),
          (e.identityProvider.config.syncMode = 'IMPORT'),
          (e.newIdentityProvider = !0);
      (e.changed = e.newIdentityProvider),
        e.$watch(
          'identityProvider',
          () => {
            angular.equals(e.identityProvider, i) || (e.changed = !0);
          },
          !0,
        ),
        (e.serverInfo = c),
        (e.allProviders = angular.copy(c.identityProviders)),
        (e.configuredProviders = angular.copy(l.identityProviders)),
        (() => {
          var r = e.allProviders.length;
          for (; r--; )
            if (
              'Social' === e.allProviders[r].groupName &&
              null != e.configuredProviders
            )
              for (var t = 0; t < e.configuredProviders.length; t++)
                if (
                  e.configuredProviders[t].providerId === e.allProviders[r].id
                ) {
                  e.allProviders.splice(r, 1);
                  break;
                }
        })(),
        (e.authFlows = []);
      for (p = 0; p < u.length; p++)
        'basic-flow' === u[p].providerId && e.authFlows.push(u[p]);
      e.postBrokerAuthFlows = [];
      e.postBrokerAuthFlows.push({ alias: '' });
      for (p = 0; p < e.authFlows.length; p++)
        e.postBrokerAuthFlows.push(e.authFlows[p]);
      e.identityProvider.postBrokerLoginFlowAlias ||
        (e.identityProvider.postBrokerLoginFlowAlias =
          e.postBrokerAuthFlows[0].alias),
        e.$watch(
          () => m.path(),
          () => {
            e.path = m.path().substring(1).split('/');
          },
        ),
        (e.files = []),
        (e.importFile = !1),
        (e.importUrl = !1),
        (e.onFileSelect = (r) => {
          (e.importFile = !0), (e.files = r);
        }),
        (e.clearFileSelect = () => {
          (e.importUrl = !1), (e.importFile = !1), (e.files = null);
        });
      var g = (r) => {
        for (var t in (void 0 !== r.enabledFromMetadata &&
          ((e.identityProvider.enabled = 'true' === r.enabledFromMetadata),
          delete r.enabledFromMetadata),
        r))
          e.identityProvider.config[t] = r[t];
      };
      if (
        ((e.uploadFile = () => {
          if (e.identityProvider.alias)
            for (var r = { providerId: o.id }, a = 0; a < e.files.length; a++) {
              var n = e.files[a];
              e.upload = t
                .upload({
                  url: `${authUrl}/admin/realms/${l.realm}/identity-provider/import-config`,
                  data: r,
                  file: n,
                })
                .progress((e) => {
                  console.log(
                    `percent: ${parseInt((100 * e.loaded) / e.total, 10)}`,
                  );
                })
                .then((r) => {
                  g(r.data),
                    e.clearFileSelect(),
                    d.success('The IDP metadata has been loaded from file.');
                })
                .catch(() => {
                  d.error(
                    'The file can not be uploaded. Please verify the file.',
                  );
                });
            }
          else d.error('You must specify an alias');
        }),
        (e.importFrom = () => {
          if (e.identityProvider.alias) {
            var r = { fromUrl: e.fromUrl.data, providerId: o.id };
            a.post(
              `${authUrl}/admin/realms/${l.realm}/identity-provider/import-config`,
              r,
            )
              .then((r) => {
                g(r.data),
                  (e.fromUrl.data = ''),
                  (e.importUrl = !1),
                  d.success('Imported config information from url.');
              })
              .catch(() => {
                d.error('Config can not be imported. Please verify the url.');
              });
          } else d.error('You must specify an alias');
        }),
        e.$watch('fromUrl.data', (_r, _t) => {
          e.fromUrl.data && e.fromUrl.data.length > 0
            ? (e.importUrl = !0)
            : (e.importUrl = !1);
        }),
        e.$watch(
          'configuredProviders',
          (r) => {
            if (r) {
              e.configuredProviders = angular.copy(r);
              for (var t = 0; t < r.length; t++) {
                var a = r[t].providerId;
                for (var n in e.allProviders) {
                  var l = e.allProviders[n];
                  l.id === a && (r[t].provider = l);
                }
              }
              e.configuredProviders = angular.copy(r);
            }
          },
          !0,
        ),
        (e.callbackUrl = `${authServerUrl}/realms/${l.realm}/broker/`),
        (e.addProvider = (e) => {
          m.url(`/create/identity-provider/${l.realm}/${e.id}`);
        }),
        (e.save = () => {
          if (e.newIdentityProvider) {
            if (!e.identityProvider.alias)
              return void d.error('You must specify an alias');
            s.save(
              { realm: e.realm.realm, alias: '' },
              e.identityProvider,
              () => {
                m.url(
                  `/realms/${l.realm}/identity-provider-settings/provider/${e.identityProvider.providerId}/${e.identityProvider.alias}`,
                ),
                  d.success(
                    `The ${e.identityProvider.alias} provider has been created.`,
                  );
              },
            );
          } else
            s.update(
              { realm: e.realm.realm, alias: e.identityProvider.alias },
              e.identityProvider,
              () => {
                n.reload(),
                  d.success(
                    `The ${e.identityProvider.alias} provider has been updated.`,
                  );
              },
            );
        }),
        (e.cancel = () => {
          e.newIdentityProvider
            ? m.url(`/realms/${l.realm}/identity-provider-settings`)
            : n.reload();
        }),
        (e.reset = () => {
          (e.identityProvider = {}),
            (e.configuredProviders = angular.copy(e.realm.identityProviders));
        }),
        (e.showPassword = (r) => {
          e.hidePassword = r;
        }),
        (e.removeIdentityProvider = (e) => {
          f.confirmDelete(e.alias, 'provider', () => {
            s.remove({ realm: l.realm, alias: e.alias }, () => {
              n.reload(), d.success('The identity provider has been deleted.');
            });
          });
        }),
        i?.alias)
      ) {
        try {
          e.authnContextClassRefs = JSON.parse(
            e.identityProvider.config.authnContextClassRefs || '[]',
          );
        } catch (_h) {
          e.authnContextClassRefs = [];
        }
        try {
          e.authnContextDeclRefs = JSON.parse(
            e.identityProvider.config.authnContextDeclRefs || '[]',
          );
        } catch (_h) {
          e.authnContextDeclRefs = [];
        }
      } else (e.authnContextClassRefs = []), (e.authnContextDeclRefs = []);
      (e.deleteAuthnContextClassRef = (r) => {
        e.authnContextClassRefs.splice(r, 1),
          (e.identityProvider.config.authnContextClassRefs = JSON.stringify(
            e.authnContextClassRefs,
          ));
      }),
        (e.addAuthnContextClassRef = () => {
          e.authnContextClassRefs.push(e.newAuthnContextClassRef),
            (e.identityProvider.config.authnContextClassRefs = JSON.stringify(
              e.authnContextClassRefs,
            )),
            (e.newAuthnContextClassRef = '');
        }),
        (e.deleteAuthnContextDeclRef = (r) => {
          e.authnContextDeclRefs.splice(r, 1),
            (e.identityProvider.config.authnContextDeclRefs = JSON.stringify(
              e.authnContextDeclRefs,
            ));
        }),
        (e.addAuthnContextDeclRef = () => {
          e.authnContextDeclRefs.push(e.newAuthnContextDeclRef),
            (e.identityProvider.config.authnContextDeclRefs = JSON.stringify(
              e.authnContextDeclRefs,
            )),
            (e.newAuthnContextDeclRef = '');
        });
    },
  ),
  module.controller(
    'RealmTokenDetailCtrl',
    (e, r, t, _a, _n, l, _i, o, _s, c, u) => {
      (e.realm = t),
        (e.serverInfo = u),
        (e.actionTokenProviders =
          e.serverInfo.providers.actionTokenHandler.providers),
        (e.realm.accessTokenLifespan = c.asUnit(t.accessTokenLifespan)),
        (e.realm.accessTokenLifespanForImplicitFlow = c.asUnit(
          t.accessTokenLifespanForImplicitFlow,
        )),
        (e.realm.ssoSessionIdleTimeout = c.asUnit(t.ssoSessionIdleTimeout)),
        (e.realm.ssoSessionMaxLifespan = c.asUnit(t.ssoSessionMaxLifespan)),
        (e.realm.ssoSessionIdleTimeoutRememberMe = c.asUnit(
          t.ssoSessionIdleTimeoutRememberMe,
        )),
        (e.realm.ssoSessionMaxLifespanRememberMe = c.asUnit(
          t.ssoSessionMaxLifespanRememberMe,
        )),
        (e.realm.offlineSessionIdleTimeout = c.asUnit(
          t.offlineSessionIdleTimeout,
        )),
        (e.realm.offlineSessionMaxLifespan = c.asUnit(
          t.offlineSessionMaxLifespan,
        )),
        (e.realm.clientSessionIdleTimeout = c.asUnit(
          t.clientSessionIdleTimeout,
        )),
        (e.realm.clientSessionMaxLifespan = c.asUnit(
          t.clientSessionMaxLifespan,
        )),
        (e.realm.clientOfflineSessionIdleTimeout = c.asUnit(
          t.clientOfflineSessionIdleTimeout,
        )),
        (e.realm.clientOfflineSessionMaxLifespan = c.asUnit(
          t.clientOfflineSessionMaxLifespan,
        )),
        (e.realm.accessCodeLifespan = c.asUnit(t.accessCodeLifespan)),
        (e.realm.accessCodeLifespanLogin = c.asUnit(t.accessCodeLifespanLogin)),
        (e.realm.accessCodeLifespanUserAction = c.asUnit(
          t.accessCodeLifespanUserAction,
        )),
        (e.realm.actionTokenGeneratedByAdminLifespan = c.asUnit(
          t.actionTokenGeneratedByAdminLifespan,
        )),
        (e.realm.actionTokenGeneratedByUserLifespan = c.asUnit(
          t.actionTokenGeneratedByUserLifespan,
        )),
        (e.realm.oauth2DeviceCodeLifespan = c.asUnit(
          t.oauth2DeviceCodeLifespan,
        )),
        (e.realm.attributes = t.attributes);
      var m = angular.copy(e.realm);
      (e.changed = !1),
        e.$watch(
          'realm',
          () => {
            angular.equals(e.realm, m) || (e.changed = !0);
          },
          !0,
        ),
        e.$watch(
          'actionLifespanId',
          () => {
            e.actionTokenAttribute?.hasOwnProperty('time') &&
              (e.changedActionLifespanId = !0),
              (e.actionTokenAttribute = c.asUnit(
                e.realm.attributes[
                  `actionTokenGeneratedByUserLifespan.${e.actionLifespanId}`
                ],
              ));
          },
          !0,
        ),
        e.$watch(
          'actionTokenAttribute',
          () => {
            null !== e.actionLifespanId &&
              (e.changedActionLifespanId
                ? (e.changedActionLifespanId = !1)
                : ((e.changed = !0),
                  null !== e.actionTokenAttribute &&
                    (e.realm.attributes[
                      `actionTokenGeneratedByUserLifespan.${e.actionLifespanId}`
                    ] = e.actionTokenAttribute.toSeconds())));
          },
          !0,
        ),
        (e.changeRevokeRefreshToken = () => {}),
        (e.save = () => {
          (e.realm.accessTokenLifespan =
            e.realm.accessTokenLifespan.toSeconds()),
            (e.realm.accessTokenLifespanForImplicitFlow =
              e.realm.accessTokenLifespanForImplicitFlow.toSeconds()),
            (e.realm.ssoSessionIdleTimeout =
              e.realm.ssoSessionIdleTimeout.toSeconds()),
            (e.realm.ssoSessionMaxLifespan =
              e.realm.ssoSessionMaxLifespan.toSeconds()),
            (e.realm.ssoSessionIdleTimeoutRememberMe =
              e.realm.ssoSessionIdleTimeoutRememberMe.toSeconds()),
            (e.realm.ssoSessionMaxLifespanRememberMe =
              e.realm.ssoSessionMaxLifespanRememberMe.toSeconds()),
            (e.realm.offlineSessionIdleTimeout =
              e.realm.offlineSessionIdleTimeout.toSeconds()),
            (e.realm.offlineSessionMaxLifespan =
              e.realm.offlineSessionMaxLifespan.toSeconds()),
            (e.realm.clientSessionIdleTimeout =
              e.realm.clientSessionIdleTimeout.toSeconds()),
            (e.realm.clientSessionMaxLifespan =
              e.realm.clientSessionMaxLifespan.toSeconds()),
            (e.realm.clientOfflineSessionIdleTimeout =
              e.realm.clientOfflineSessionIdleTimeout.toSeconds()),
            (e.realm.clientOfflineSessionMaxLifespan =
              e.realm.clientOfflineSessionMaxLifespan.toSeconds()),
            (e.realm.accessCodeLifespan =
              e.realm.accessCodeLifespan.toSeconds()),
            (e.realm.accessCodeLifespanUserAction =
              e.realm.accessCodeLifespanUserAction.toSeconds()),
            (e.realm.accessCodeLifespanLogin =
              e.realm.accessCodeLifespanLogin.toSeconds()),
            (e.realm.actionTokenGeneratedByAdminLifespan =
              e.realm.actionTokenGeneratedByAdminLifespan.toSeconds()),
            (e.realm.actionTokenGeneratedByUserLifespan =
              e.realm.actionTokenGeneratedByUserLifespan.toSeconds()),
            (e.realm.oauth2DeviceCodeLifespan =
              e.realm.oauth2DeviceCodeLifespan.toSeconds()),
            r.update(e.realm, () => {
              l.reload(),
                o.success('The changes have been saved to the realm.');
            });
        }),
        (e.resetToDefaultToken = (_r) => {
          (e.actionTokenAttribute = {}),
            delete e.realm.attributes[
              `actionTokenGeneratedByUserLifespan.${e.actionLifespanId}`
            ],
            (e.actionTokenAttribute.unit = 'Minutes');
        }),
        (e.reset = () => {
          l.reload();
        });
    },
  ),
  module.controller('ViewKeyCtrl', (e, r) => {
    e.key = r;
  }),
  module.controller(
    'RealmKeysCtrl',
    (e, _r, t, _a, _n, _l, _i, _o, _s, c, u, m) => {
      (e.realm = angular.copy(t)),
        (e.keys = c.keys),
        (e.active = {}),
        u.query(
          {
            realm: t.realm,
            parent: t.id,
            type: 'org.keycloak.keys.KeyProvider',
          },
          (r) => {
            for (var t = 0; t < c.keys.length; t++)
              for (var a = 0; a < r.length; a++)
                c.keys[t].providerId === r[a].id && (c.keys[t].provider = r[a]);
            for (var n in c.active)
              for (t = 0; t < c.keys.length; t++)
                c.active[n] === c.keys[t].kid && (e.active[n] = c.keys[t]);
          },
        ),
        (e.viewKey = (e) => {
          m.open({
            templateUrl: `${resourceUrl}/partials/modal/view-key.html`,
            controller: 'ViewKeyCtrl',
            resolve: { key: () => e },
          });
        });
    },
  ),
  module.controller(
    'RealmKeysProvidersCtrl',
    (e, _r, t, _a, n, l, i, o, s, c, _u) => {
      (e.realm = angular.copy(t)),
        (e.enableUpload = !1),
        (e.providers = s.componentTypes['org.keycloak.keys.KeyProvider']),
        c.query(
          {
            realm: t.realm,
            parent: t.id,
            type: 'org.keycloak.keys.KeyProvider',
          },
          (r) => {
            e.instances = r;
            for (var t = 0; t < e.instances.length; t++)
              for (var a = 0; a < e.providers.length; a++)
                e.providers[a].id === e.instances[t].providerId &&
                  (e.instances[t].provider = e.providers[a]);
          },
        ),
        (e.addProvider = (e) => {
          l.url(`/create/keys/${t.realm}/providers/${e.id}`);
        }),
        (e.removeInstance = (e) => {
          i.confirmDelete(e.name, 'key provider', () => {
            c.remove({ realm: t.realm, componentId: e.id }, () => {
              n.reload(), o.success('The provider has been deleted.');
            });
          });
        });
    },
  ),
  module.controller('GenericKeystoreCtrl', (e, r, t, a, _n, l, i, o, s, c) => {
    (e.create = !o.providerId), (e.realm = l);
    for (
      var u = i.componentTypes['org.keycloak.keys.KeyProvider'],
        m = null,
        d = 0;
      d < u.length;
      d++
    ) {
      var f = u[d];
      if (f.id === s) {
        (e.providerFactory = f), (m = f);
        break;
      }
    }
    if (
      (e.create
        ? (e.instance = {
            name: m.id,
            providerId: m.id,
            providerType: 'org.keycloak.keys.KeyProvider',
            parentId: l.id,
            config: { priority: ['0'] },
          })
        : (e.instance = angular.copy(o)),
      m.properties)
    )
      for (d = 0; d < m.properties.length; d++) {
        var p = m.properties[d];
        e.instance.config[p.name] ||
          (p.defaultValue
            ? ((e.instance.config[p.name] = [p.defaultValue]),
              e.create || (o.config[p.name] = [p.defaultValue]))
            : ((e.instance.config[p.name] = ['']),
              e.create || (o.config[p.name] = [p.defaultValue])));
      }
    e.$watch(
      'instance',
      () => {
        angular.equals(e.instance, o) || (e.changed = !0);
      },
      !0,
    ),
      (e.save = () => {
        (e.changed = !1),
          e.create
            ? c.save({ realm: l.realm }, e.instance, (_a, n) => {
                var i = n().location,
                  o = i.substring(i.lastIndexOf('/') + 1);
                r.url(
                  `/realms/${l.realm}/keys/providers/${e.instance.providerId}/${o}`,
                ),
                  t.success('The provider has been created.');
              })
            : c.update(
                { realm: l.realm, componentId: o.id },
                e.instance,
                () => {
                  a.reload(), t.success('The provider has been updated.');
                },
              );
      }),
      (e.reset = () => {
        a.reload();
      }),
      (e.cancel = () => {
        e.create ? r.url(`/realms/${l.realm}/keys`) : a.reload();
      });
  }),
  module.controller('RealmSessionStatsCtrl', (e, r, t, _a, n, l) => {
    (e.realm = r),
      (e.stats = t),
      (e.logoutAll = () => {
        n.save({ realm: r.realm }, (e) => {
          var r = e.successRequests ? e.successRequests.length : 0;
          if ((e.failedRequests ? e.failedRequests.length : 0) > 0) {
            var t =
              r > 0
                ? `Successfully logout all users under: ${e.successRequests} . `
                : '';
            l.error(
              `${t}Failed to logout users under: ${e.failedRequests}. Verify availability of failed hosts and try again`,
            );
          } else window.location.reload();
        });
      });
  }),
  module.controller('RealmRevocationCtrl', (e, r, t, a, _n, _l, _i, o) => {
    e.realm = angular.copy(a);
    var s = () => {
      0 === e.realm.notBefore
        ? (e.notBefore = 'None')
        : (e.notBefore = new Date(1e3 * e.realm.notBefore));
    };
    s();
    var c = () => {
      r.get({ id: a.realm }, (r) => {
        (e.realm = r), s();
      });
    };
    (e.clear = () => {
      r.update({ realm: a.realm, notBefore: 0 }, () => {
        (e.notBefore = 'None'), o.success('Not Before cleared for realm.'), c();
      });
    }),
      (e.setNotBeforeNow = () => {
        r.update({ realm: a.realm, notBefore: Date.now() / 1e3 }, () => {
          o.success('Not Before set for realm.'), c();
        });
      }),
      (e.pushRevocation = () => {
        t.save({ realm: a.realm }, (e) => {
          var r = e.successRequests ? e.successRequests.length : 0,
            t = e.failedRequests ? e.failedRequests.length : 0;
          if (0 === r && 0 === t)
            o.warn(
              'No push sent. No admin URI configured or no registered cluster nodes available',
            );
          else if (t > 0) {
            var a =
              r > 0
                ? `Successfully push notBefore to: ${e.successRequests} . `
                : '';
            o.error(
              `${a}Failed to push notBefore to: ${e.failedRequests}. Verify availability of failed hosts and try again`,
            );
          } else
            o.success('Successfully push notBefore to all configured clients');
        });
      });
  }),
  module.controller('RoleTabCtrl', (e, r, _t, a, _n) => {
    r.removeRole = () => {
      e.confirmDelete(r.role.name, 'role', () => {
        RoleById.remove({ realm: realm.realm, role: r.role.id }, () => {
          $route.reload(), a.success('The role has been deleted.');
        });
      });
    };
  }),
  module.controller('RoleListCtrl', (e, r, t, a, n, l, i, _o) => {
    (e.realm = n),
      (e.roles = []),
      (e.defaultRoleName = n.defaultRole.name),
      (e.query = { realm: n.realm, search: null, max: 20, first: 0 }),
      e.$watch(
        'query.search',
        (_r, _t) => {
          e.query.search && e.query.search.length >= 3 && e.firstPage();
        },
        !0,
      ),
      (e.firstPage = () => {
        (e.query.first = 0), e.searchQuery();
      }),
      (e.previousPage = () => {
        (e.query.first -= parseInt(e.query.max, 10)),
          e.query.first < 0 && (e.query.first = 0),
          e.searchQuery();
      }),
      (e.nextPage = () => {
        (e.query.first += parseInt(e.query.max, 10)), e.searchQuery();
      }),
      (e.searchQuery = () => {
        (e.searchLoaded = !1),
          (e.roles = l.query(e.query, () => {
            (e.searchLoaded = !0), (e.lastSearch = e.query.search);
          }));
      }),
      e.searchQuery(),
      (e.determineEditLink = (r) =>
        r.name === e.defaultRoleName
          ? `/realms/${e.realm.realm}/default-roles`
          : `/realms/${e.realm.realm}/roles/${r.id}`),
      (e.removeRole = (l) => {
        l.name !== e.defaultRoleName &&
          t.confirmDelete(l.name, 'role', () => {
            i.remove({ realm: n.realm, role: l.id }, () => {
              r.reload(), a.success('The role has been deleted.');
            });
          });
      });
  }),
  module.controller(
    'RoleDetailCtrl',
    (e, r, t, a, n, l, i, o, s, c, u, m, d, f, p, v, g) => {
      (e.realm = r),
        (e.role = angular.copy(t)),
        (e.create = !t.name),
        (e.changed = e.create),
        (e.save = () => {
          !(() => {
            var r = e.role.attributes;
            for (var t in r)
              if ('string' === typeof r[t]) {
                var a = r[t].split('##');
                r[t] = a;
              }
          })(),
            console.log('save'),
            e.create
              ? i.save({ realm: r.realm }, e.role, (_a, _n) => {
                  (e.changed = !1),
                    ((e) => {
                      var r = e.attributes;
                      for (var t in r)
                        if ('object' === typeof r[t]) {
                          var a = r[t].join('##');
                          (r[t] = a), console.log(`attribute${a}`);
                        }
                    })(e.role),
                    (t = angular.copy(e.role)),
                    i.get({ realm: r.realm, role: t.name }, (e) => {
                      var t = e.id;
                      d.url(`/realms/${r.realm}/roles/${t}`),
                        p.success('The role has been created.');
                    });
                })
              : e.update();
        }),
        (e.remove = () => {
          v.remove(e.role, r, f, d, p);
        }),
        (e.cancel = () => {
          d.url(`/realms/${r.realm}/roles`);
        }),
        (e.addAttribute = () => {
          (e.role.attributes[e.newAttribute.key] = e.newAttribute.value),
            delete e.newAttribute;
        }),
        (e.removeAttribute = (r) => {
          delete e.role.attributes[r];
        }),
        roleControl(e, l, r, t, a, n, o, s, c, u, m, d, p, f, g);
    },
  ),
  module.controller('RealmSMTPSettingsCtrl', (e, _r, t, a, _n, l, _i, o, s) => {
    console.log('RealmSMTPSettingsCtrl');
    var c = ['auth', 'ssl', 'starttls'];
    (e.realm = a),
      e.realm.smtpServer &&
        (e.realm.smtpServer = ((e) => {
          for (var r in e)
            c.indexOf(r) < 0 ||
              ('true' === e[r] ? (e[r] = !0) : 'false' === e[r] && (e[r] = !1));
          return (e.port = parseInt(e.port, 10)), e;
        })(e.realm.smtpServer));
    var u = angular.copy(e.realm);
    (e.changed = !1),
      e.$watch(
        'realm',
        () => {
          angular.equals(e.realm, u) || (e.changed = !0);
        },
        !0,
      ),
      (e.save = () => {
        var r = angular.copy(e.realm);
        (r.smtpServer = ((e) => {
          for (var r in e)
            c.indexOf(r) < 0 ||
              (!0 === e[r] ? (e[r] = 'true') : !1 === e[r] && (e[r] = 'false'));
          return (e.port = e.port?.toString()), e;
        })(r.smtpServer)),
          (e.changed = !1),
          t.update(r, () => {
            l.url(`/realms/${a.realm}/smtp-settings`),
              o.success('Your changes have been saved to the realm.');
          });
      }),
      (e.reset = () => {
        (e.realm = angular.copy(u)), (e.changed = !1);
      }),
      (e.testConnection = () => {
        s.save(
          { realm: a.realm },
          a.smtpServer,
          () => {
            o.success('SMTP connection successful. E-mail was sent!');
          },
          (_e) => {
            error.data.errorMessage
              ? o.error(error.data.errorMessage)
              : o.error('Unexpected error during SMTP validation');
          },
        );
      });
  }),
  module.controller(
    'RealmEventsConfigCtrl',
    (e, r, t, a, n, l, i, o, s, c, u) => {
      (e.realm = l),
        (e.eventsConfig = r),
        (e.eventsConfig.expirationUnit = c.autoUnit(r.eventsExpiration)),
        (e.eventsConfig.eventsExpiration = c.toUnit(
          r.eventsExpiration,
          e.eventsConfig.expirationUnit,
        )),
        (e.eventListeners = Object.keys(i.providers.eventsListener.providers)),
        (e.eventsConfigSelectOptions = {
          multiple: !0,
          simple_tags: !0,
          tags: e.eventListeners,
        }),
        (e.eventSelectOptions = {
          multiple: !0,
          simple_tags: !0,
          tags: i.enums.eventType,
        });
      var m = angular.copy(e.eventsConfig);
      (e.changed = !1),
        e.$watch(
          'eventsConfig',
          () => {
            angular.equals(e.eventsConfig, m) || (e.changed = !0);
          },
          !0,
        ),
        (e.save = () => {
          e.changed = !1;
          var r = angular.copy(e.eventsConfig);
          delete r.expirationUnit,
            (r.eventsExpiration = c.toSeconds(
              e.eventsConfig.eventsExpiration,
              e.eventsConfig.expirationUnit,
            )),
            t.update({ id: l.realm }, r, () => {
              o.url(`/realms/${l.realm}/events-settings`),
                s.success('Your changes have been saved to the realm.');
            });
        }),
        (e.reset = () => {
          (e.eventsConfig = angular.copy(m)), (e.changed = !1);
        }),
        (e.clearEvents = () => {
          u.confirmDelete(e.realm.realm, 'events', () => {
            a.remove({ id: e.realm.realm }, () => {
              s.success('The events has been cleared.');
            });
          });
        }),
        (e.clearAdminEvents = () => {
          u.confirmDelete(e.realm.realm, 'admin-events', () => {
            n.remove({ id: e.realm.realm }, () => {
              s.success('The admin events has been cleared.');
            });
          });
        });
    },
  ),
  module.controller('RealmEventsCtrl', (e, r, t, a) => {
    (e.realm = t),
      (e.page = 0),
      (e.eventSelectOptions = {
        multiple: !0,
        simple_tags: !0,
        tags: a.enums.eventType,
      }),
      (e.query = { id: t.realm, max: 5, first: 0 }),
      (e.disablePaste = (e) => (e.preventDefault(), !1)),
      (e.update = () => {
        for (var t in ((e.query.first = 0), e.query))
          '' === e.query[t] && delete e.query[t];
        e.events = r.query(e.query);
      }),
      (e.reset = () => {
        (e.query.first = 0),
          (e.query.max = 5),
          (e.query.type = ''),
          (e.query.client = ''),
          (e.query.user = ''),
          (e.query.dateFrom = ''),
          (e.query.dateTo = ''),
          e.update();
      }),
      (e.queryUpdate = () => {
        for (var t in e.query) '' === e.query[t] && delete e.query[t];
        e.events = r.query(e.query);
      }),
      (e.firstPage = () => {
        (e.query.first = 0), e.queryUpdate();
      }),
      (e.previousPage = () => {
        (e.query.first -= parseInt(e.query.max, 10)),
          e.query.first < 0 && (e.query.first = 0),
          e.queryUpdate();
      }),
      (e.nextPage = () => {
        (e.query.first += parseInt(e.query.max, 10)), e.queryUpdate();
      }),
      e.update();
  }),
  module.controller('RealmAdminEventsCtrl', (e, r, t, a, n, _l) => {
    (e.realm = t),
      (e.page = 0),
      (e.query = { id: t.realm, max: 5, first: 0 }),
      (e.adminEnabledEventOperationsOptions = {
        multiple: !0,
        simple_tags: !0,
        tags: a.enums.operationType,
      }),
      (e.adminEnabledEventResourceTypesOptions = {
        multiple: !0,
        simple_tags: !0,
        tags: a.enums.resourceType,
      }),
      (e.disablePaste = (e) => (e.preventDefault(), !1)),
      (e.update = () => {
        for (var t in ((e.query.first = 0), e.query))
          '' === e.query[t] && delete e.query[t];
        e.events = r.query(e.query);
      }),
      (e.reset = () => {
        (e.query.first = 0),
          (e.query.max = 5),
          (e.query.operationTypes = ''),
          (e.query.resourceTypes = ''),
          (e.query.resourcePath = ''),
          (e.query.authRealm = ''),
          (e.query.authClient = ''),
          (e.query.authUser = ''),
          (e.query.authIpAddress = ''),
          (e.query.dateFrom = ''),
          (e.query.dateTo = ''),
          e.update();
      }),
      (e.queryUpdate = () => {
        for (var t in e.query) '' === e.query[t] && delete e.query[t];
        e.events = r.query(e.query);
      }),
      (e.firstPage = () => {
        (e.query.first = 0), e.queryUpdate();
      }),
      (e.previousPage = () => {
        (e.query.first -= parseInt(e.query.max, 10)),
          e.query.first < 0 && (e.query.first = 0),
          e.queryUpdate();
      }),
      (e.nextPage = () => {
        (e.query.first += parseInt(e.query.max, 10)), e.queryUpdate();
      }),
      e.update(),
      (e.viewRepresentation = (e) => {
        n.open({
          templateUrl: `${resourceUrl}/partials/modal/realm-events-admin-representation.html`,
          controller: 'RealmAdminEventsModalCtrl',
          resolve: { event: () => e },
        });
      }),
      (e.viewAuth = (e) => {
        n.open({
          templateUrl: `${resourceUrl}/partials/modal/realm-events-admin-auth.html`,
          controller: 'RealmAdminEventsModalCtrl',
          resolve: { event: () => e },
        });
      });
  }),
  module.controller('RealmAdminEventsModalCtrl', (e, _r, t) => {
    e.event = t;
  }),
  module.controller('RealmBruteForceCtrl', (e, r, t, _a, n, _l, i, o, s) => {
    console.log('RealmBruteForceCtrl'),
      (e.realm = t),
      (e.realm.waitIncrementUnit = o.autoUnit(t.waitIncrementSeconds)),
      (e.realm.waitIncrement = o.toUnit(
        t.waitIncrementSeconds,
        e.realm.waitIncrementUnit,
      )),
      (e.realm.minimumQuickLoginWaitUnit = o.autoUnit(
        t.minimumQuickLoginWaitSeconds,
      )),
      (e.realm.minimumQuickLoginWait = o.toUnit(
        t.minimumQuickLoginWaitSeconds,
        e.realm.minimumQuickLoginWaitUnit,
      )),
      (e.realm.maxFailureWaitUnit = o.autoUnit(t.maxFailureWaitSeconds)),
      (e.realm.maxFailureWait = o.toUnit(
        t.maxFailureWaitSeconds,
        e.realm.maxFailureWaitUnit,
      )),
      (e.realm.maxDeltaTimeUnit = o.autoUnit(t.maxDeltaTimeSeconds)),
      (e.realm.maxDeltaTime = o.toUnit(
        t.maxDeltaTimeSeconds,
        e.realm.maxDeltaTimeUnit,
      ));
    var c = angular.copy(e.realm);
    (e.changed = !1),
      e.$watch(
        'realm',
        () => {
          angular.equals(e.realm, c) || (e.changed = !0);
        },
        !0,
      ),
      (e.save = () => {
        var a = angular.copy(e.realm);
        delete a.waitIncrementUnit,
          delete a.waitIncrement,
          delete a.minimumQuickLoginWaitUnit,
          delete a.minimumQuickLoginWait,
          delete a.maxFailureWaitUnit,
          delete a.maxFailureWait,
          delete a.maxDeltaTimeUnit,
          delete a.maxDeltaTime,
          (a.waitIncrementSeconds = o.toSeconds(
            e.realm.waitIncrement,
            e.realm.waitIncrementUnit,
          )),
          (a.minimumQuickLoginWaitSeconds = o.toSeconds(
            e.realm.minimumQuickLoginWait,
            e.realm.minimumQuickLoginWaitUnit,
          )),
          (a.maxFailureWaitSeconds = o.toSeconds(
            e.realm.maxFailureWait,
            e.realm.maxFailureWaitUnit,
          )),
          (a.maxDeltaTimeSeconds = o.toSeconds(
            e.realm.maxDeltaTime,
            e.realm.maxDeltaTimeUnit,
          )),
          (e.changed = !1),
          r.update(a, () => {
            (c = angular.copy(e.realm)),
              n.url(`/realms/${t.realm}/defense/brute-force`),
              i.success('Your changes have been saved to the realm.');
          });
      }),
      (e.reset = () => {
        s.reload();
      });
  }),
  module.controller('IdentityProviderMapperListCtrl', (e, r, t, a, n) => {
    (e.realm = r),
      (e.identityProvider = t),
      (e.mapperTypes = a),
      (e.mappers = n);
  }),
  module.controller(
    'IdentityProviderMapperCtrl',
    (e, r, t, a, n, l, i, o, s) => {
      (e.realm = r),
        (e.identityProvider = t),
        (e.create = !1),
        (e.mapper = angular.copy(n)),
        (e.changed = !1),
        (e.mapperType = a[n.identityProviderMapper]),
        e.$watch(
          () => s.path(),
          () => {
            e.path = s.path().substring(1).split('/');
          },
        ),
        e.$watch(
          'mapper',
          () => {
            angular.equals(e.mapper, n) || (e.changed = !0);
          },
          !0,
        ),
        (e.save = () => {
          l.update(
            { realm: r.realm, alias: t.alias, mapperId: n.id },
            e.mapper,
            () => {
              (e.changed = !1),
                (n = angular.copy(e.mapper)),
                s.url(
                  `/realms/${r.realm}/identity-provider-mappers/${t.alias}/mappers/${n.id}`,
                ),
                i.success('Your changes have been saved.');
            },
          );
        }),
        (e.reset = () => {
          (e.mapper = angular.copy(n)), (e.changed = !1);
        }),
        (e.cancel = () => {
          window.history.back();
        }),
        (e.remove = () => {
          o.confirmDelete(e.mapper.name, 'mapper', () => {
            l.remove(
              {
                realm: r.realm,
                alias: n.identityProviderAlias,
                mapperId: e.mapper.id,
              },
              () => {
                i.success('The mapper has been deleted.'),
                  s.url(
                    `/realms/${r.realm}/identity-provider-mappers/${t.alias}/mappers`,
                  );
              },
            );
          });
        });
    },
  ),
  module.controller(
    'IdentityProviderMapperCreateCtrl',
    (e, r, t, a, n, l, _i, o) => {
      (e.realm = r),
        (e.identityProvider = t),
        (e.create = !0),
        (e.mapper = { identityProviderAlias: t.alias, config: {} }),
        (e.mapperTypes = a),
        (e.mapperType = a[Object.keys(a)[0]]),
        (e.mapper.config.syncMode = 'INHERIT'),
        e.$watch(
          () => o.path(),
          () => {
            e.path = o.path().substring(1).split('/');
          },
        ),
        (e.save = () => {
          (e.mapper.identityProviderMapper = e.mapperType.id),
            n.save({ realm: r.realm, alias: t.alias }, e.mapper, (_e, a) => {
              var n = a().location,
                i = n.substring(n.lastIndexOf('/') + 1);
              o.url(
                `/realms/${r.realm}/identity-provider-mappers/${t.alias}/mappers/${i}`,
              ),
                l.success('Mapper has been created.');
            });
        }),
        (e.cancel = () => {
          window.history.back();
        });
    },
  ),
  module.controller('RealmFlowBindingCtrl', (e, r, t, a, n, l, i, o, s, c) => {
    (e.flows = []), (e.clientFlows = []);
    for (var u = 0; u < r.length; u++)
      'client-flow' === r[u].providerId
        ? e.clientFlows.push(r[u])
        : e.flows.push(r[u]);
    (e.profileInfo = l.profileInfo),
      genericRealmUpdate(
        e,
        t,
        a,
        n,
        l,
        i,
        o,
        s,
        c,
        `/realms/${n.realm}/authentication/flow-bindings`,
      );
  }),
  module.controller('CreateFlowCtrl', (e, r, t, a, n) => {
    console.debug('CreateFlowCtrl'),
      (e.realm = r),
      (e.flow = {
        alias: '',
        providerId: 'basic-flow',
        description: '',
        topLevel: !0,
        builtIn: !1,
      }),
      (e.save = () => {
        t.save({ realm: r.realm, flow: '' }, e.flow, () => {
          n.url(`/realms/${r.realm}/authentication/flows/${e.flow.alias}`),
            a.success('Flow Created.');
        });
      }),
      (e.cancel = () => {
        n.url(`/realms/${r.realm}/authentication/flows`);
      });
  }),
  module.controller('CreateExecutionFlowCtrl', (e, r, t, a, n, l, i) => {
    (e.realm = r), (e.formProviders = a);
    var o = 'client-flow' === t.providerId ? 'client-flow' : 'basic-flow';
    (e.flow = { alias: '', type: o, description: '' }),
      (e.provider = {}),
      a.length > 0 && (e.provider = a[0]),
      (e.save = () => {
        (e.flow.provider = e.provider.id),
          n.save({ realm: r.realm, alias: t.alias }, e.flow, () => {
            i.url(`/realms/${r.realm}/authentication/flows`),
              l.success('Flow Created.');
          });
      }),
      (e.cancel = () => {
        i.url(`/realms/${r.realm}/authentication/flows`);
      });
  }),
  module.controller('CreateExecutionCtrl', (e, r, t, a, n, l, i, o, s) => {
    (e.realm = r),
      (e.parentFlow = t),
      'form-flow' === t.providerId
        ? (e.providers = a)
        : 'client-flow' === t.providerId
          ? (e.providers = l)
          : (e.providers = n),
      (e.provider = {}),
      e.providers.length > 0 && (e.provider = e.providers[0]),
      (e.save = () => {
        var a = { provider: e.provider.id };
        i.save({ realm: r.realm, alias: t.alias }, a, () => {
          s.url(`/realms/${r.realm}/authentication/flows`),
            o.success('Execution Created.');
        });
      }),
      (e.cancel = () => {
        s.url(`/realms/${r.realm}/authentication/flows`);
      });
  }),
  module.controller(
    'AuthenticationFlowsCtrl',
    (e, _r, t, a, n, l, i, o, s, c, u, m, d, f, _p, v, g, h, y) => {
      if (
        ((e.realm = t),
        (e.flows = a),
        null !== n && (l.alias = n),
        null === n && null !== l.alias && (n = l.alias),
        a.length > 0 && ((e.flow = a[0]), n))
      )
        for (var R = 0; R < a.length; R++)
          if (a[R].alias === n) {
            e.flow = a[R];
            break;
          }
      e.selectFlow = (e) => {
        y.url(`/realms/${t.realm}/authentication/flows/${e.alias}`);
      };
      var w = () => {
        u.query({ realm: t.realm, alias: e.flow.alias }, (r) => {
          (e.executions = r), (e.choicesmax = 0), (e.levelmax = 0);
          for (var t = 0; t < e.executions.length; t++) {
            (a = e.executions[t]).requirementChoices.length > e.choicesmax &&
              (e.choicesmax = a.requirementChoices.length),
              a.level > e.levelmax && (e.levelmax = a.level);
          }
          for (e.levelmaxempties = [], j = 0; j < e.levelmax; j++)
            e.levelmaxempties.push(j);
          for (t = 0; t < e.executions.length; t++) {
            var a;
            for (
              (a = e.executions[t]).empties = [], j = 0;
              j < e.choicesmax - a.requirementChoices.length;
              j++
            )
              a.empties.push(j);
            for (a.preLevels = [], j = 0; j < a.level; j++) a.preLevels.push(j);
            for (a.postLevels = [], j = a.level; j < e.levelmax; j++)
              a.postLevels.push(j);
          }
        });
      };
      (e.copyFlow = () => {
        g.open('Copy Authentication Flow', e.flow.alias, (r) => {
          s.save(
            { realm: t.realm, alias: e.flow.alias },
            { newName: r },
            () => {
              y.url(`/realms/${t.realm}/authentication/flows/${r}`),
                v.success('Flow copied.');
            },
          );
        });
      }),
        (e.deleteFlow = () => {
          i.confirmDelete(e.flow.alias, 'flow', () => {
            e.removeFlow();
          });
        }),
        (e.removeFlow = () => {
          console.log(`Remove flow:${e.flow.alias}`),
            t.browserFlow === e.flow.alias
              ? v.error(
                  'Cannot remove flow, it is currently being used as the browser flow.',
                )
              : t.registrationFlow === e.flow.alias
                ? v.error(
                    'Cannot remove flow, it is currently being used as the registration flow.',
                  )
                : t.directGrantFlow === e.flow.alias
                  ? v.error(
                      'Cannot remove flow, it is currently being used as the direct grant flow.',
                    )
                  : t.resetCredentialsFlow === e.flow.alias
                    ? v.error(
                        'Cannot remove flow, it is currently being used as the reset credentials flow.',
                      )
                    : t.clientAuthenticationFlow === e.flow.alias
                      ? v.error(
                          'Cannot remove flow, it is currently being used as the client authentication flow.',
                        )
                      : t.dockerAuthenticationFlow === e.flow.alias
                        ? v.error(
                            'Cannot remove flow, it is currently being used as the docker authentication flow.',
                          )
                        : o.remove({ realm: t.realm, flow: e.flow.id }, () => {
                            y.url(
                              `/realms/${t.realm}/authentication/flows/${a[0].alias}`,
                            ),
                              v.success('Flow removed');
                          });
        }),
        (e.editFlow = (e) => {
          var r = angular.copy(e);
          h.open(
            'Update Authentication Flow',
            r.alias,
            r.description,
            (a, n) => {
              (r.alias = a),
                (r.description = n),
                c.update({ realm: t.realm, flow: e.id }, r, () => {
                  y.url(`/realms/${t.realm}/authentication/flows/${a}`),
                    v.success('Flow updated');
                });
            },
          );
        }),
        (e.addFlow = () => {
          y.url(
            `/realms/${t.realm}/authentication/flows/${e.flow.id}/create/flow/execution/${e.flow.id}`,
          );
        }),
        (e.addSubFlow = (r) => {
          y.url(
            `/realms/${t.realm}/authentication/flows/${r.flowId}/create/flow/execution/${e.flow.alias}`,
          );
        }),
        (e.addSubFlowExecution = (r) => {
          y.url(
            `/realms/${t.realm}/authentication/flows/${r.flowId}/create/execution/${e.flow.alias}`,
          );
        }),
        (e.addExecution = () => {
          y.url(
            `/realms/${t.realm}/authentication/flows/${e.flow.id}/create/execution/${e.flow.id}`,
          );
        }),
        (e.createFlow = () => {
          y.url(`/realms/${t.realm}/authentication/create/flow`);
        }),
        (e.updateExecution = (r) => {
          var a = angular.copy(r);
          delete a.empties,
            delete a.levels,
            delete a.preLevels,
            delete a.postLevels,
            u.update({ realm: t.realm, alias: e.flow.alias }, a, () => {
              v.success('Auth requirement updated'), w();
            });
        }),
        (e.editExecutionFlow = (r) => {
          var a = angular.copy(r);
          delete a.empties,
            delete a.levels,
            delete a.preLevels,
            delete a.postLevels,
            h.open(
              'Update Execution Flow',
              a.displayName,
              a.description,
              (r, n) => {
                (a.displayName = r),
                  (a.description = n),
                  u.update({ realm: t.realm, alias: e.flow.alias }, a, () => {
                    v.success('Execution Flow updated'), w();
                  });
              },
            );
        }),
        (e.removeExecution = (e) => {
          console.log(`removeExecution: ${e.id}`);
          var r = e.authenticationFlow ? 'flow' : 'execution';
          i.confirmDelete(e.displayName, r, () => {
            m.remove({ realm: t.realm, execution: e.id }, () => {
              v.success(`The ${r} was removed.`), w();
            });
          });
        }),
        (e.raisePriority = (e) => {
          d.save({ realm: t.realm, execution: e.id }, () => {
            v.success('Priority raised'), w();
          });
        }),
        (e.lowerPriority = (e) => {
          f.save({ realm: t.realm, execution: e.id }, () => {
            v.success('Priority lowered'), w();
          });
        }),
        (e.setupForm = w),
        null == n ? e.selectFlow(a[0]) : w();
    },
  ),
  module.controller('RequiredActionsCtrl', (e, r, t, a, n, l, i, o, s, c) => {
    console.log('RequiredActionsCtrl'),
      (e.realm = r),
      (e.unregisteredRequiredActions = t),
      (e.requiredActions = []);
    var u = () => {
      console.log('setupRequiredActionsForm'),
        i.query({ realm: r.realm }, (r) => {
          e.requiredActions = [];
          for (var t = 0; t < r.length; t++) e.requiredActions.push(r[t]);
        });
    };
    (e.updateRequiredAction = (e) => {
      i.update({ realm: r.realm, alias: e.alias }, e, () => {
        c.success('Required action updated'), u();
      });
    }),
      (e.raisePriority = (e) => {
        o.save({ realm: r.realm, alias: e.alias }, () => {
          c.success("Required action's priority raised"), u();
        });
      }),
      (e.lowerPriority = (e) => {
        s.save({ realm: r.realm, alias: e.alias }, () => {
          c.success("Required action's priority lowered"), u();
        });
      }),
      (e.register = () => {
        a.open({
          templateUrl: `${resourceUrl}/partials/modal/unregistered-required-action-selector.html`,
          controller: (e, a) => {
            (e.unregisteredRequiredActions = t),
              (e.selected = { selected: e.unregisteredRequiredActions[0] }),
              (e.ok = () => {
                a.close(),
                  l.save({ realm: r.realm }, e.selected.selected, () => {
                    n.reload();
                  });
              }),
              (e.cancel = () => {
                a.dismiss('cancel');
              });
          },
          resolve: {},
        });
      }),
      u();
  }),
  module.controller(
    'AuthenticationConfigCtrl',
    (e, r, t, a, n, l, i, o, s, c) => {
      (e.realm = r),
        (e.flow = t),
        (e.configType = a),
        (e.create = !1),
        (e.config = angular.copy(n)),
        (e.changed = !1),
        e.$watch(
          () => s.path(),
          () => {
            e.path = s.path().substring(1).split('/');
          },
        ),
        e.$watch(
          'config',
          () => {
            angular.equals(e.config, n) || (e.changed = !0);
          },
          !0,
        ),
        (e.save = () => {
          var o = angular.copy(e.config);
          c.convertAllListValuesToMultivaluedString(a.properties, o.config),
            l.update({ realm: r.realm, config: n.id }, o, () => {
              (e.changed = !1),
                (n = angular.copy(e.config)),
                s.url(
                  `/realms/${r.realm}/authentication/flows/${t.id}/config/${a.providerId}/${n.id}`,
                ),
                i.success('Your changes have been saved.');
            });
        }),
        (e.reset = () => {
          (e.config = angular.copy(n)), (e.changed = !1);
        }),
        (e.cancel = () => {
          window.history.back();
        }),
        (e.remove = () => {
          o.confirmDelete(e.config.alias, 'config', () => {
            l.remove({ realm: r.realm, config: e.config.id }, () => {
              i.success('The config has been deleted.'),
                s.url(`/realms/${r.realm}/authentication/flows/${t.id}`);
            });
          });
        });
    },
  ),
  module.controller(
    'AuthenticationConfigCreateCtrl',
    (e, r, t, a, n, l, i, _o, s, c) => {
      (e.realm = r), (e.flow = t), (e.create = !0), (e.configType = a);
      var u = {};
      if (a && Array.isArray(a.properties))
        for (var m = 0; m < a.properties.length; m++) {
          var d = a.properties[m];
          d?.name && (u[d.name] = d.defaultValue);
        }
      (e.config = { config: u }),
        e.$watch(
          () => s.path(),
          () => {
            e.path = s.path().substring(1).split('/');
          },
        ),
        (e.save = () => {
          var o = angular.copy(e.config);
          c.convertAllListValuesToMultivaluedString(a.properties, o.config),
            l.save({ realm: r.realm, execution: n }, o, (_e, n) => {
              var l = n().location,
                o = l.substring(l.lastIndexOf('/') + 1),
                c = `/realms/${r.realm}/authentication/flows/${t.id}/config/${a.providerId}/${o}`;
              console.log(`redirect url: ${c}`),
                s.url(c),
                i.success('Config has been created.');
            });
        }),
        (e.cancel = () => {
          window.history.back();
        });
    },
  ),
  module.controller('ClientInitialAccessCtrl', (e, r, t, a, n, l, i, _o) => {
    (e.realm = r),
      (e.clientInitialAccess = t),
      (e.remove = (e) => {
        n.confirmDelete(e, 'initial access token', () => {
          a.remove({ realm: r.realm, id: e }, () => {
            l.success('The initial access token was deleted.'), i.reload();
          });
        });
      });
  }),
  module.controller('ClientInitialAccessCreateCtrl', (e, r, t, a, n, l, i) => {
    (e.expirationUnit = 'Days'),
      (e.expiration = a.toUnit(0, e.expirationUnit)),
      (e.count = 1),
      (e.realm = r),
      (e.save = () => {
        var n = a.toSeconds(e.expiration, e.expirationUnit);
        t.save({ realm: r.realm }, { expiration: n, count: e.count }, (r) => {
          console.debug(r), (e.id = r.id), (e.token = r.token);
        });
      }),
      (e.cancel = () => {
        l.url(`/realms/${r.realm}/client-registration/client-initial-access`);
      }),
      (e.done = () => {
        var e = {
            ok: { label: i.instant('continue'), cssClass: 'btn btn-primary' },
            cancel: { label: i.instant('cancel'), cssClass: 'btn btn-default' },
          },
          t = i.instant('initial-access-token.confirm.title'),
          a = i.instant('initial-access-token.confirm.text');
        n.open(t, a, e, () => {
          l.url(`/realms/${r.realm}/client-registration/client-initial-access`);
        });
      });
  }),
  module.controller('ClientRegPoliciesCtrl', (e, r, t, a, n, l, i, o, s) => {
    (e.realm = r),
      (e.providers = t),
      (e.anonPolicies = []),
      (e.authPolicies = []);
    for (var c = 0; c < a.length; c++) {
      var u = a[c];
      if ('anonymous' === u.subType) e.anonPolicies.push(u);
      else {
        if ('authenticated' !== u.subType)
          throw 'subType is required for clientRegistration policy component!';
        e.authPolicies.push(u);
      }
    }
    (e.addProvider = (e, t) => {
      console.log(`Add provider: authType ${e}, providerId: ${t.id}`),
        s.url(
          `/realms/${r.realm}/client-registration/client-reg-policies/create/${e}/${t.id}`,
        );
    }),
      (e.getInstanceLink = (e) =>
        `/realms/${r.realm}/client-registration/client-reg-policies/${e.providerId}/${e.id}`),
      (e.removeInstance = (e) => {
        n.confirmDelete(e.name, 'client registration policy', () => {
          i.remove({ realm: r.realm, componentId: e.id }, () => {
            o.reload(), l.success('The policy has been deleted.');
          });
        });
      });
  }),
  module.controller(
    'ClientRegPolicyDetailCtrl',
    (e, r, t, a, _n, l, i, o, s, c, u) => {
      (e.realm = r), (e.instance = a), (e.providerTypes = t);
      for (let f = 0; f < e.providerTypes.length; f++) {
        const r = e.providerTypes[f];
        if (r.id === a.providerId) {
          e.providerType = r;
          break;
        }
      }
      function m(e) {
        return 'MultivaluedString' === e.type || 'MultivaluedList' === e.type
          ? e.defaultValue
            ? e.defaultValue
            : []
          : e.defaultValue
            ? [e.defaultValue]
            : [''];
      }
      if (
        ((e.create = !e.instance.name),
        u(`${e.instance.providerId}.label`)
          .then((r) => {
            e.headerTitle = r;
          })
          .catch(() => {
            e.headerTitle = e.instance.providerId;
          }),
        e.create &&
          ((e.instance.name = ''),
          (e.instance.parentId = r.id),
          (e.instance.config = {}),
          e.providerType.properties))
      )
        for (let f = 0; f < e.providerType.properties.length; f++) {
          const r = e.providerType.properties[f];
          e.instance.config[r.name] = m(r);
        }
      e.providerType.properties &&
        (o.addLastEmptyValueToMultivaluedLists(
          e.providerType.properties,
          e.instance.config,
        ),
        o.addMvOptionsToMultivaluedLists(e.providerType.properties));
      const d = angular.copy(e.instance);
      (e.changed = !1),
        e.$watch(
          'instance',
          () => {
            angular.equals(e.instance, d) || (e.changed = !0);
          },
          !0,
        ),
        (e.reset = () => {
          e.create ? window.history.back() : s.reload();
        }),
        (e.hasValidValues = () => e.changed && e.instance.name),
        (e.save = () => {
          (e.changed = !1),
            e.create
              ? i.save({ realm: r.realm }, e.instance, (_t, a) => {
                  var n = a().location,
                    i = n.substring(n.lastIndexOf('/') + 1);
                  c.url(
                    `/realms/${r.realm}/client-registration/client-reg-policies/${e.instance.providerId}/${i}`,
                  ),
                    l.success('The policy has been created.');
                })
              : i.update(
                  { realm: r.realm, componentId: a.id },
                  e.instance,
                  () => {
                    s.reload(), l.success('The policy has been updated.');
                  },
                );
        });
    },
  ),
  module.controller('RealmImportCtrl', (e, r, t, a, n, l) => {
    (e.rawContent = {}),
      (e.fileContent = { enabled: !0 }),
      (e.changed = !1),
      (e.files = []),
      (e.realm = r),
      (e.overwrite = !1),
      (e.skip = !1),
      (e.importUsers = !1),
      (e.importGroups = !1),
      (e.importClients = !1),
      (e.importIdentityProviders = !1),
      (e.importRealmRoles = !1),
      (e.importClientRoles = !1),
      (e.ifResourceExists = 'FAIL'),
      (e.isMultiRealm = !1),
      (e.results = {}),
      (e.currentPage = 0);
    var i = angular.copy(e.fileContent);
    function o() {
      return 15 * e.currentPage;
    }
    function s() {
      (e.importUsers = e.hasArray('users')),
        (e.importGroups = e.hasArray('groups')),
        (e.importClients = e.hasArray('clients')),
        (e.importIdentityProviders = e.hasArray('identityProviders')),
        (e.importRealmRoles = e.hasRealmRoles()),
        (e.importClientRoles = e.hasClientRoles());
    }
    (e.importFile = (r) => {
      var t;
      try {
        t = JSON.parse(r);
      } catch (_n) {
        return void a.error('Unable to parse JSON file.');
      }
      (e.rawContent = angular.copy(t)),
        Array.isArray(e.rawContent) && e.rawContent.length > 0
          ? (e.rawContent.length > 1 && (e.isMultiRealm = !0),
            (e.fileContent = e.rawContent[0]))
          : (e.fileContent = e.rawContent),
        (e.importing = !0),
        s(),
        (e.results = {}),
        e.hasResources() || e.nothingToImport();
    }),
      (e.hasResults = () =>
        Object.keys(e.results).length > 0 &&
        void 0 !== e.results.results &&
        e.results.results.length > 0),
      (e.resultsPage = () =>
        e.hasResults()
          ? e.results.results.slice(
              o(),
              (() => {
                var r = e.results.results.length,
                  t = o() + 15;
                t > r && (t = r);
                return t;
              })(),
            )
          : {}),
      (e.setFirstPage = () => {
        e.currentPage = 0;
      }),
      (e.setNextPage = () => {
        e.currentPage++;
      }),
      (e.setPreviousPage = () => {
        e.currentPage--;
      }),
      (e.hasNext = () =>
        !!e.hasResults() && e.results.results.length > o() + 15),
      (e.hasPrevious = () => !!e.hasResults() && e.currentPage > 0),
      (e.viewImportDetails = () => {
        n.open({
          templateUrl: `${resourceUrl}/partials/modal/view-object.html`,
          controller: 'ObjectModalCtrl',
          resolve: { object: () => e.fileContent },
        });
      }),
      (e.hasArray = (r) =>
        'undefined' !== e.fileContent &&
        Object.hasOwn(e.fileContent, r) &&
        Array.isArray(e.fileContent[r]) &&
        e.fileContent[r].length > 0),
      (e.hasRealmRoles = () =>
        e.hasRoles() &&
        Object.hasOwn(e.fileContent.roles, 'realm') &&
        Array.isArray(e.fileContent.roles.realm) &&
        e.fileContent.roles.realm.length > 0),
      (e.hasRoles = () =>
        'undefined' !== e.fileContent &&
        Object.hasOwn(e.fileContent, 'roles') &&
        'undefined' !== e.fileContent.roles),
      (e.hasClientRoles = () =>
        e.hasRoles() &&
        Object.hasOwn(e.fileContent.roles, 'client') &&
        Object.keys(e.fileContent.roles.client).length > 0),
      (e.itemCount = (r) =>
        e.importing
          ? e.hasRealmRoles() && 'roles.realm' === r
            ? e.fileContent.roles.realm.length
            : e.hasClientRoles() && 'roles.client' === r
              ? clientRolesCount(e.fileContent.roles.client)
              : Object.hasOwn(e.fileContent, r)
                ? e.fileContent[r].length
                : 0
          : 0),
      (clientRolesCount = (e) => {
        var r = 0;
        for (var t in e) r += e[t].length;
        return r;
      }),
      (e.hasResources = () =>
        (e.importUsers && e.hasArray('users')) ||
        (e.importGroups && e.hasArray('groups')) ||
        (e.importClients && e.hasArray('clients')) ||
        (e.importIdentityProviders && e.hasArray('identityProviders')) ||
        (e.importRealmRoles && e.hasRealmRoles()) ||
        (e.importClientRoles && e.hasClientRoles())),
      (e.nothingToImport = () => {
        a.error('No resources specified to import.');
      }),
      e.$watch(
        'fileContent',
        () => {
          angular.equals(e.fileContent, i) || (e.changed = !0), s();
        },
        !0,
      ),
      (e.successMessage = () => {
        var r = `${e.results.added} records added. `;
        return (
          'SKIP' === e.ifResourceExists &&
            (r += `${e.results.skipped} records skipped.`),
          'OVERWRITE' === e.ifResourceExists &&
            (r += `${e.results.overwritten} records overwritten.`),
          r
        );
      }),
      (e.save = () => {
        var t = angular.copy(e.fileContent);
        (t.ifResourceExists = e.ifResourceExists),
          e.importUsers || delete t.users,
          e.importGroups || delete t.groups,
          e.importIdentityProviders || delete t.identityProviders,
          e.importClients || delete t.clients,
          Object.hasOwn(t, 'roles') &&
            (e.importRealmRoles || delete t.roles.realm,
            e.importClientRoles || delete t.roles.client);
        var n = l(`${authUrl}/admin/realms/${r.realm}/partialImport`);
        e.results = n.save(
          t,
          () => {
            a.success(e.successMessage());
          },
          (e) => {
            e.data.errorMessage
              ? a.error(e.data.errorMessage)
              : a.error('Unexpected error during import');
          },
        );
      }),
      (e.reset = () => {
        t.reload();
      });
  }),
  module.controller('RealmExportCtrl', (e, r, t, a, n, l) => {
    function i() {
      var l = `${authUrl}/admin/realms/${r.realm}/partial-export`,
        i = {};
      e.exportGroupsAndRoles && (i.exportGroupsAndRoles = !0),
        e.exportClients && (i.exportClients = !0),
        Object.keys(i).length > 0 && (l += `?${a(i)}`),
        t
          .post(l)
          .then((e) => {
            var r = angular.fromJson(e.data);
            (r = angular.toJson(r, !0)),
              saveAs(
                new Blob([r], { type: 'application/json' }),
                'realm-export.json',
              );
          })
          .catch(() => {
            n.error('Sorry, something went wrong.');
          });
    }
    (e.realm = r),
      (e.exportGroupsAndRoles = !1),
      (e.exportClients = !1),
      (e.export = () => {
        e.exportGroupsAndRoles || e.exportClients
          ? l.confirm(
              'Export',
              'This operation may make server unresponsive for a while.\n\nAre you sure you want to proceed?',
              i,
            )
          : i();
      });
  });
