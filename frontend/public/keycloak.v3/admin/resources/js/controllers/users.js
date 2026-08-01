function loadUserStorageLink(e, r, n, i, t, o, s) {
  r.federationLink
    ? (n.log(`federationLink is not null. It is ${r.federationLink}`),
      o.access.viewRealm
        ? i.get({ realm: e.realm, componentId: r.federationLink }, (r) => {
            (o.federationLinkName = r.name),
              (o.federationLink = `#/realms/${e.realm}/user-storage/providers/${r.providerId}/${r.id}`);
          })
        : t.simpleName.get(
            { realm: e.realm, componentId: r.federationLink },
            (e) => {
              (o.federationLinkName = e.name), (o.federationLink = s.absUrl());
            },
          ))
    : n.log('federationLink is null'),
    r.origin
      ? o.access.viewRealm
        ? i.get({ realm: e.realm, componentId: r.origin }, (r) => {
            (o.originName = r.name),
              (o.originLink = `#/realms/${e.realm}/user-storage/providers/${r.providerId}/${r.id}`);
          })
        : t.simpleName.get({ realm: e.realm, componentId: r.origin }, (e) => {
            (o.originName = e.name), (o.originLink = s.absUrl());
          })
      : n.log('origin is null');
}
function removeGroupMember(e, r) {
  for (var n = 0; n < e.length; n++) {
    if (r.path === e[n].path) {
      e.splice(n, 1);
      break;
    }
    e[n].subGroups &&
      e[n].subGroups.length > 0 &&
      removeGroupMember(e[n].subGroups, r);
  }
}
module.controller(
  'UserRoleMappingCtrl',
  (e, r, n, i, t, o, s, a, l, c, u, d, m, p, f) => {
    (e.realm = i),
      (e.user = t),
      (e.selectedRealmRoles = []),
      (e.selectedRealmMappings = []),
      (e.realmMappings = []),
      (e.client = o),
      (e.clientRoles = []),
      (e.clientComposite = []),
      (e.selectedClientRoles = []),
      (e.selectedClientMappings = []),
      (e.clientMappings = []),
      (e.dummymodel = []),
      (e.selectedClient = null),
      (e.realmMappings = l.query({ realm: i.realm, userId: t.id })),
      (e.realmRoles = u.query({ realm: i.realm, userId: t.id })),
      (e.realmComposite = m.query({ realm: i.realm, userId: t.id })),
      (e.addRealmRole = () => {
        (e.realmRolesToAdd = JSON.parse(`[${e.selectedRealmRoles}]`)),
          (e.selectedRealmRoles = []),
          r
            .post(
              `${authUrl}/admin/realms/${i.realm}/users/${t.id}/role-mappings/realm`,
              e.realmRolesToAdd,
            )
            .then(() => {
              (e.realmMappings = l.query({ realm: i.realm, userId: t.id })),
                (e.realmRoles = u.query({ realm: i.realm, userId: t.id })),
                (e.realmComposite = m.query({ realm: i.realm, userId: t.id })),
                (e.selectedRealmMappings = []),
                (e.selectRealmRoles = []),
                e.selectedClient &&
                  (console.log('load available'),
                  (e.clientComposite = p.query({
                    realm: i.realm,
                    userId: t.id,
                    client: e.selectedClient.id,
                  })),
                  (e.clientRoles = d.query({
                    realm: i.realm,
                    userId: t.id,
                    client: e.selectedClient.id,
                  })),
                  (e.clientMappings = c.query({
                    realm: i.realm,
                    userId: t.id,
                    client: e.selectedClient.id,
                  })),
                  (e.selectedClientRoles = []),
                  (e.selectedClientMappings = [])),
                a.success(f.instant('user.roles.add.success'));
            });
      }),
      (e.deleteRealmRole = () => {
        (e.realmRolesToRemove = JSON.parse(`[${e.selectedRealmMappings}]`)),
          r
            .delete(
              `${authUrl}/admin/realms/${i.realm}/users/${t.id}/role-mappings/realm`,
              {
                data: e.realmRolesToRemove,
                headers: { 'content-type': 'application/json' },
              },
            )
            .then(() => {
              (e.realmMappings = l.query({ realm: i.realm, userId: t.id })),
                (e.realmRoles = u.query({ realm: i.realm, userId: t.id })),
                (e.realmComposite = m.query({ realm: i.realm, userId: t.id })),
                (e.selectedRealmMappings = []),
                (e.selectRealmRoles = []),
                e.selectedClient &&
                  (console.log('load available'),
                  (e.clientComposite = p.query({
                    realm: i.realm,
                    userId: t.id,
                    client: e.selectedClient.id,
                  })),
                  (e.clientRoles = d.query({
                    realm: i.realm,
                    userId: t.id,
                    client: e.selectedClient.id,
                  })),
                  (e.clientMappings = c.query({
                    realm: i.realm,
                    userId: t.id,
                    client: e.selectedClient.id,
                  })),
                  (e.selectedClientRoles = []),
                  (e.selectedClientMappings = [])),
                a.success(f.instant('user.roles.remove.success'));
            });
      }),
      (e.addClientRole = () => {
        (e.clientRolesToAdd = JSON.parse(`[${e.selectedClientRoles}]`)),
          r
            .post(
              `${authUrl}/admin/realms/${i.realm}/users/${t.id}/role-mappings/clients/${e.selectedClient.id}`,
              e.clientRolesToAdd,
            )
            .then(() => {
              (e.clientMappings = c.query({
                realm: i.realm,
                userId: t.id,
                client: e.selectedClient.id,
              })),
                (e.clientRoles = d.query({
                  realm: i.realm,
                  userId: t.id,
                  client: e.selectedClient.id,
                })),
                (e.clientComposite = p.query({
                  realm: i.realm,
                  userId: t.id,
                  client: e.selectedClient.id,
                })),
                (e.selectedClientRoles = []),
                (e.selectedClientMappings = []),
                (e.realmComposite = m.query({ realm: i.realm, userId: t.id })),
                (e.realmRoles = u.query({ realm: i.realm, userId: t.id })),
                a.success(f.instant('user.roles.add.success'));
            });
      }),
      (e.deleteClientRole = () => {
        (e.clientRolesToRemove = JSON.parse(`[${e.selectedClientMappings}]`)),
          r
            .delete(
              `${authUrl}/admin/realms/${i.realm}/users/${t.id}/role-mappings/clients/${e.selectedClient.id}`,
              {
                data: e.clientRolesToRemove,
                headers: { 'content-type': 'application/json' },
              },
            )
            .then(() => {
              (e.clientMappings = c.query({
                realm: i.realm,
                userId: t.id,
                client: e.selectedClient.id,
              })),
                (e.clientRoles = d.query({
                  realm: i.realm,
                  userId: t.id,
                  client: e.selectedClient.id,
                })),
                (e.clientComposite = p.query({
                  realm: i.realm,
                  userId: t.id,
                  client: e.selectedClient.id,
                })),
                (e.selectedClientRoles = []),
                (e.selectedClientMappings = []),
                (e.realmComposite = m.query({ realm: i.realm, userId: t.id })),
                (e.realmRoles = u.query({ realm: i.realm, userId: t.id })),
                a.success(f.instant('user.roles.remove.success'));
            });
      }),
      (e.changeClient = (r) => {
        console.log('selected client: ', r),
          r?.id
            ? ((e.selectedClient = r),
              e.selectedClient
                ? (console.log('load available'),
                  (e.clientComposite = p.query({
                    realm: i.realm,
                    userId: t.id,
                    client: e.selectedClient.id,
                  })),
                  (e.clientRoles = d.query({
                    realm: i.realm,
                    userId: t.id,
                    client: e.selectedClient.id,
                  })),
                  (e.clientMappings = c.query({
                    realm: i.realm,
                    userId: t.id,
                    client: e.selectedClient.id,
                  })))
                : ((e.clientRoles = null),
                  (e.clientMappings = null),
                  (e.clientComposite = null)),
              (e.selectedClientRoles = []),
              (e.selectedClientMappings = []))
            : (e.selectedClient = null);
      }),
      clientSelectControl(e, n.current.params.realm, s);
  },
),
  module.controller('UserSessionsCtrl', (e, r, n, i, t, o, s, a, l) => {
    (e.realm = r),
      (e.user = n),
      (e.sessions = i),
      (e.logoutAll = () => {
        o.save({ realm: r.realm, user: n.id }, () => {
          a.success(l.instant('user.logout.all.success')),
            t.query({ realm: r.realm, user: n.id }, (r) => {
              e.sessions = r;
            });
        });
      }),
      (e.logoutSession = (i) => {
        console.log('here in logoutSession'),
          s.delete({ realm: r.realm, session: i }, () => {
            t.query({ realm: r.realm, user: n.id }, (r) => {
              (e.sessions = r),
                a.success(l.instant('user.logout.session.success'));
            });
          });
      });
  }),
  module.controller(
    'UserFederatedIdentityCtrl',
    (e, _r, n, i, t, o, s, a, l) => {
      (e.realm = n),
        (e.user = i),
        (e.federatedIdentities = t),
        (e.hasAnyProvidersToCreate = () =>
          n.identityProviders.length - e.federatedIdentities.length > 0),
        (e.removeProviderLink = (r) => {
          console.log(`Removing provider link: ${r.identityProvider}`),
            a.confirmWithButtonText(
              l.instant('user.fedid.link.remove.confirm.title', {
                name: r.identityProvider,
              }),
              l.instant('user.fedid.link.remove.confirm.message', {
                name: r.identityProvider,
              }),
              l.instant('dialogs.delete.confirm'),
              () => {
                o.remove(
                  { realm: n.realm, user: i.id, provider: r.identityProvider },
                  () => {
                    s.success(l.instant('user.fedid.link.remove.success'));
                    var n = e.federatedIdentities.indexOf(r);
                    e.federatedIdentities.splice(n, 1);
                  },
                );
              },
            );
        });
    },
  ),
  module.controller(
    'UserFederatedIdentityAddCtrl',
    (e, r, n, i, t, o, s, a) => {
      (e.realm = n), (e.user = i), (e.federatedIdentity = {});
      (e.availableProvidersToCreate = (() => {
        for (var e = [], r = 0; r < n.identityProviders.length; r++) {
          var i = n.identityProviders[r].alias;
          e.push(i);
        }
        for (r = 0; r < t.length; r++) {
          i = t[r].identityProvider;
          var o = e.indexOf(i);
          e.splice(o, 1);
        }
        return e;
      })()),
        (e.save = () => {
          o.save(
            {
              realm: n.realm,
              user: i.id,
              provider: e.federatedIdentity.identityProvider,
            },
            e.federatedIdentity,
            (_i, _t) => {
              r.url(`/realms/${n.realm}/users/${e.user.id}/federated-identity`),
                s.success(a.instant('user.fedid.link.add.success'));
            },
          );
        }),
        (e.cancel = () => {
          r.url(`/realms/${n.realm}/users/${e.user.id}/federated-identity`);
        });
    },
  ),
  module.controller('UserConsentsCtrl', (e, r, n, i, t, o, s) => {
    (e.realm = r),
      (e.user = n),
      (e.userConsents = i),
      (e.revokeConsent = (i) => {
        t.delete(
          { realm: r.realm, user: n.id, client: i },
          () => {
            t.query({ realm: r.realm, user: n.id }, (r) => {
              e.userConsents = r;
            }),
              o.success(s.instant('user.consent.revoke.success'));
          },
          () => {
            o.error(s.instant('user.consent.revoke.error'));
          },
        ),
          console.log(`Revoke consent ${i}`);
      });
  }),
  module.controller('UserOfflineSessionsCtrl', (e, r, n, i, t, o) => {
    (e.realm = n),
      (e.user = i),
      (e.client = t),
      (e.offlineSessions = o),
      (e.cancel = () => {
        r.url(`/realms/${n.realm}/users/${i.id}/consents`);
      });
  }),
  module.controller('UserListCtrl', (e, r, n, i, t, o, s, a, l, c) => {
    (e.init = () => {
      (e.realm = r),
        (i.query.realm = r.realm),
        (e.query = i.query),
        (e.query.briefRepresentation = 'true'),
        i.isFirstSearch || e.searchQuery();
    }),
      (e.impersonate = (e) => {
        t.save({ realm: r.realm, user: e }, (e) => {
          e.sameRealm
            ? (window.location = e.redirect)
            : window.open(e.redirect, '_blank');
        });
      }),
      (e.unlockUsers = () => {
        o.delete({ realm: r.realm }, (_e) => {
          s.success(c.instant('user.unlock.success'));
        });
      }),
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
        console.log(`query.search: ${e.query.search}`),
          (e.searchLoaded = !1),
          (e.users = n.query(e.query, () => {
            (e.searchLoaded = !0),
              (e.lastSearch = e.query.search),
              (i.isFirstSearch = !1);
          }));
      }),
      (e.removeUser = (n) => {
        l.confirmWithButtonText(
          c.instant('user.remove.confirm.title', { name: n.id }),
          c.instant('user.remove.confirm.message', { name: n.id }),
          c.instant('dialogs.delete.confirm'),
          () => {
            n.$remove(
              { realm: r.realm, userId: n.id },
              () => {
                a.reload(),
                  1 === e.users.length && e.query.first > 0 && e.previousPage(),
                  s.success(c.instant('user.remove.success'));
              },
              () => {
                s.error(c.instant('user.remove.error'));
              },
            );
          },
        );
      });
  }),
  module.controller('UserTabCtrl', (e, r, n, i, t) => {
    e.removeUser = () => {
      n.confirmDelete(e.user.id, 'user', () => {
        e.user.$remove(
          { realm: t.realm.realm, userId: e.user.id },
          () => {
            r.url(`/realms/${t.realm.realm}/users`),
              i.success($translate.instant('user.remove.success'));
          },
          () => {
            i.error($translate.instant('user.remove.error'));
          },
        );
      });
    };
  }),
  module.controller(
    'UserDetailCtrl',
    (e, r, n, i, t, o, s, a, l, c, _u, _d, m, p, f) => {
      if (
        ((e.realm = r),
        (e.create = !n.id),
        (e.editUsername = e.create || e.realm.editUsernameAllowed),
        (e.emailAsUsername = e.realm.registrationEmailAsUsername),
        (e.groupSearch = { selectedGroup: null }),
        e.create)
      )
        e.user = { enabled: !0, attributes: {}, groups: [] };
      else {
        n.attributes || (n.attributes = {}),
          v(n),
          (e.user = angular.copy(n)),
          (e.impersonate = () => {
            s.save({ realm: r.realm, user: e.user.id }, (e) => {
              e.sameRealm
                ? (window.location = e.redirect)
                : window.open(e.redirect, '_blank');
            });
          }),
          loadUserStorageLink(r, n, console, o, l, e, c),
          console.log(`realm brute force? ${r.bruteForceProtected}`),
          (e.temporarilyDisabled = !1);
        var g = () => {
          i.get({ realm: r.realm, userId: n.id }, (r) => {
            console.log(`here in isDisabled ${r.disabled}`),
              (e.temporarilyDisabled = r.disabled);
          });
        };
        console.log('check if disabled'),
          g(),
          (e.unlockUser = () => {
            i.delete({ realm: r.realm, userId: n.id }, (_e) => {
              g();
            });
          });
      }
      if (((e.changed = !1), n.requiredActions))
        for (var h = 0; h < n.requiredActions.length; h++)
          console.log(`user require action: ${n.requiredActions[h]}`);
      function v(e) {
        var r = e.attributes;
        for (var n in r)
          if ('object' === typeof r[n]) {
            var i = r[n].join('##');
            r[n] = i;
          }
      }
      function y(e, r) {
        if (e.subGroups && 0 !== e.subGroups.length)
          for (var n = 0; n < e.subGroups.length; n++) {
            var i = e.subGroups[n];
            r.push(i), y(i, r);
          }
      }
      a.query({ realm: r.realm }, (r) => {
        e.userReqActionList = [];
        for (var n = 0; n < r.length; n++)
          if (
            (console.log(`listed required action: ${r[n].name}`), r[n].enabled)
          ) {
            var i = r[n];
            e.userReqActionList.push(i);
          }
        console.log('---------------------'),
          console.log(
            `ng-model: user.requiredActions=${JSON.stringify(e.user.requiredActions)}`,
          ),
          console.log('---------------------'),
          console.log(
            `ng-repeat: userReqActionList=${JSON.stringify(e.userReqActionList)}`,
          ),
          console.log('---------------------');
      }),
        e.$watch(
          'user',
          () => {
            angular.equals(e.user, n) || (e.changed = !0);
          },
          !0,
        ),
        (e.save = () => {
          !(() => {
            var r = e.user.attributes;
            for (var n in r)
              if ('string' === typeof r[n]) {
                var i = r[n].split('##');
                r[n] = i;
              }
          })(),
            e.create
              ? (!(() => {
                  var r = e.user.groups;
                  if (e.selectedGroups)
                    for (h = 0; h < e.selectedGroups.length; h++) {
                      var n = e.selectedGroups[h].path;
                      r.includes(n) || r.push(n);
                    }
                })(),
                t.save({ realm: r.realm }, e.user, (_i, t) => {
                  (e.changed = !1), v(e.user), (n = angular.copy(e.user));
                  var o = t().location;
                  console.debug(`Location == ${o}`);
                  var s = o.substring(o.lastIndexOf('/') + 1);
                  c.url(`/realms/${r.realm}/users/${s}`),
                    m.success(p.instant('user.create.success'));
                }))
              : t.update({ realm: r.realm, userId: e.user.id }, e.user, () => {
                  (e.changed = !1),
                    v(e.user),
                    (n = angular.copy(e.user)),
                    m.success(p.instant('user.edit.success'));
                });
        }),
        (e.reset = () => {
          (e.user = angular.copy(n)), (e.changed = !1);
        }),
        (e.cancel = () => {
          c.url(`/realms/${r.realm}/users`);
        }),
        (e.addAttribute = () => {
          (e.user.attributes[e.newAttribute.key] = e.newAttribute.value),
            delete e.newAttribute;
        }),
        (e.removeAttribute = (r) => {
          delete e.user.attributes[r];
        }),
        (e.groupsUiSelect = {
          minimumInputLength: 1,
          delay: 500,
          allowClear: !0,
          query: (n) => {
            var i = { results: [] };
            '' !== n.term.trim()
              ? ((e.query = {
                  realm: r.realm,
                  search: n.term.trim(),
                  max: 20,
                  first: 0,
                }),
                f.query(e.query, (r) => {
                  var t, o, s;
                  (i.results =
                    ((t = ((e) => {
                      var r = [];
                      if (!e || 0 === e.length) return e;
                      for (var n = 0; n < e.length; n++)
                        r.push(e[n]), y(e[n], r);
                      return r;
                    })(r)),
                    (o = n.term.trim()),
                    (s = e.selectedGroups),
                    t && 0 !== t.length
                      ? (s || (s = []),
                        t.filter(
                          (e) =>
                            e.path?.includes(o) &&
                            !s.some((r) => r.id === e.id),
                        ))
                      : t)),
                    n.callback(i);
                }))
              : n.callback(i);
          },
          formatResult: (e, _r, _n) => ((e.text = e.path), e.path),
        }),
        (e.removeGroup = (e, r) => {
          for (h = 0; h < angular.copy(e).length; h++)
            r.id === e[h].id && e.splice(h, 1);
        }),
        (e.selectGroup = (r) => {
          if (r?.id) {
            for (
              e.groupSearch.selectedGroup = r,
                e.selectedGroups || (e.selectedGroups = []),
                h = 0;
              h < e.selectedGroups.length;
              h++
            )
              if (e.selectedGroups[h].id === r.id) return;
            e.selectedGroups.push(r), (e.groupSearch.selectedGroup = null);
          }
        }),
        (e.clearGroupSelection = () => {
          (e.groupSearch.selectedGroup = null),
            $('#groups').val(null).trigger('change.select2');
        });
    },
  ),
  module.controller(
    'UserCredentialsCtrl',
    (e, r, n, i, t, o, _s, a, l, c, u, d, m, p, f, g) => {
      console.log('UserCredentialsCtrl'),
        (e.hasPassword = !1),
        l.getCredentials(
          { realm: r.realm, userId: n.id },
          null,
          (r) => {
            e.credentials = r.map(
              (r) => (
                r.credentialData &&
                  (r.credentialData = JSON.parse(r.credentialData)),
                'password' === r.type && (e.hasPassword = !0),
                r
              ),
            );
          },
          (e) => {
            c.error(g.instant('user.credential.fetch.error')), console.log(e);
          },
        ),
        l.getConfiguredUserStorageCredentialTypes(
          { realm: r.realm, userId: n.id },
          null,
          (r) => {
            (e.userStorageCredentialTypes = r),
              (e.hasPassword = e.hasPassword || r.lastIndexOf('password') > -1);
          },
          (e) => {
            c.error(g.instant('user.credential.storage.fetch.error')),
              console.log(e);
          },
        ),
        loadUserStorageLink(r, n, console, m, p, e, t),
        (e.getUserStorageProviderName = () =>
          n.federationLink ? e.federationLinkName : e.originName),
        (e.getUserStorageProviderLink = () =>
          n.federationLink ? e.federationLink : e.originLink),
        (e.updateCredentialLabel = (e) => {
          l.updateCredentialLabel(
            { realm: r.realm, userId: n.id, credentialId: e.id },
            {
              id: e.id,
              userLabel: e.userLabel ? e.userLabel : '',
              credentialData: JSON.stringify(e.credentialData),
            },
            () => {
              c.success(g.instant('user.credential.update.success'));
            },
            (e) => {
              c.error(g.instant('user.credential.update.error')),
                console.log(e);
            },
          );
        }),
        (e.deleteCredential = (e) => {
          u.confirmWithButtonText(
            g.instant('user.credential.remove.confirm.title', { name: e.id }),
            g.instant('user.credential.remove.confirm.message', { name: e.id }),
            g.instant('dialogs.delete.confirm'),
            () => {
              l.deleteCredential(
                { realm: r.realm, userId: n.id, credentialId: e.id },
                null,
                () => {
                  c.success(g.instant('user.credential.remove.success')),
                    i.reload();
                },
                (e) => {
                  c.error(g.instant('user.credential.remove.error')),
                    console.log(e);
                },
              );
            },
          );
        }),
        (e.moveUp = (e, t) => {
          0 !== t &&
            (1 === t
              ? l.moveToFirst(
                  { realm: r.realm, userId: n.id, credentialId: e[t].id },
                  () => {
                    i.reload();
                  },
                  (e) => {
                    c.error(g.instant('user.credential.move-top.error')),
                      console.log(e);
                  },
                )
              : l.moveCredentialAfter(
                  {
                    realm: r.realm,
                    userId: n.id,
                    credentialId: e[t].id,
                    newPreviousCredentialId: e[t - 2].id,
                  },
                  () => {
                    i.reload();
                  },
                  (e) => {
                    c.error(g.instant('user.credential.move-up.error')),
                      console.log(e);
                  },
                ));
        }),
        (e.moveDown = (e, t) => {
          t !== e.length - 1 &&
            l.moveCredentialAfter(
              {
                realm: r.realm,
                userId: n.id,
                credentialId: e[t].id,
                newPreviousCredentialId: e[t + 1].id,
              },
              () => {
                i.reload();
              },
              (e) => {
                c.error(g.instant('user.credential.move-down.error')),
                  console.log(e);
              },
            );
        }),
        (e.showData = (e) => {
          f.open({
            templateUrl: `${resourceUrl}/partials/modal/user-credential-data.html`,
            controller: 'UserCredentialsDataModalCtrl',
            resolve: { credentialData: () => e },
          });
        }),
        (e.realm = r),
        (e.user = angular.copy(n)),
        (e.temporaryPassword = !0),
        (e.isTotp = !1),
        n.totp && (e.isTotp = n.totp),
        o.query({ realm: r.realm }, (r) => {
          e.userReqActionList = [];
          for (var n = 0; n < r.length; n++)
            if (
              (console.log(`listed required action: ${r[n].name}`),
              r[n].enabled)
            ) {
              var i = r[n];
              e.userReqActionList.push(i);
            }
        }),
        (e.resetPassword = () => {
          if (e.passwordAndConfirmPasswordEntered())
            if (e.pwdChange && e.password !== e.confirmPassword)
              c.error(g.instant('user.password.error.not-matching'));
            else {
              var t = e.hasPassword
                  ? g.instant('user.password.reset.confirm.title')
                  : g.instant('user.password.set.confirm.title'),
                o = e.hasPassword
                  ? g.instant('user.password.reset.confirm.message')
                  : g.instant('user.password.set.confirm.message'),
                s = e.hasPassword
                  ? g.instant('user.password.reset.success')
                  : g.instant('user.password.set.success');
              u.confirm(
                t,
                o,
                () => {
                  l.resetPassword(
                    { realm: r.realm, userId: n.id },
                    {
                      type: 'password',
                      value: e.password,
                      temporary: e.temporaryPassword,
                    },
                    () => {
                      c.success(s),
                        (e.password = null),
                        (e.confirmPassword = null),
                        i.reload();
                    },
                  );
                },
                () => {
                  (e.password = null), (e.confirmPassword = null);
                },
              );
            }
        }),
        (e.passwordAndConfirmPasswordEntered = () =>
          e.password && e.confirmPassword),
        (e.disableCredentialTypes = () => {
          u.confirm(
            g.instant('user.credential.disable.confirm.title'),
            g.instant('user.credential.disable.confirm.message'),
            () => {
              l.disableCredentialTypes(
                { realm: r.realm, userId: n.id },
                e.disableableCredentialTypes,
                () => {
                  i.reload(),
                    c.success(
                      g.instant('user.credential.disable.confirm.success'),
                    );
                },
                () => {
                  c.error(g.instant('user.credential.disable.confirm.error'));
                },
              );
            },
          );
        }),
        (e.emailActions = []),
        (e.emailActionsTimeout = d.asUnit(
          r.actionTokenGeneratedByAdminLifespan,
        )),
        (e.disableableCredentialTypes = []),
        (e.sendExecuteActionsEmail = () => {
          e.changed
            ? u.message(
                g.instant('user.actions-email.send.pending-changes.title'),
                g.instant('user.actions-email.send.pending-changes.message'),
              )
            : u.confirm(
                g.instant('user.actions-email.send.confirm.title'),
                g.instant('user.actions-email.send.confirm.message'),
                () => {
                  a.update(
                    {
                      realm: r.realm,
                      userId: n.id,
                      lifespan: e.emailActionsTimeout.toSeconds(),
                    },
                    e.emailActions,
                    () => {
                      c.success(
                        g.instant('user.actions-email.send.confirm.success'),
                      );
                    },
                    () => {
                      c.error(
                        g.instant('user.actions-email.send.confirm.error'),
                      );
                    },
                  );
                },
              );
        }),
        e.$watch(
          'user',
          () => {
            angular.equals(e.user, n)
              ? (e.userChange = !1)
              : (e.userChange = !0);
          },
          !0,
        ),
        e.$watch(
          'password',
          () => {
            e.password ? (e.pwdChange = !0) : (e.pwdChange = !1);
          },
          !0,
        ),
        (e.reset = () => {
          (e.password = ''),
            (e.confirmPassword = ''),
            (e.user = angular.copy(n)),
            (e.isTotp = !1),
            n.totp && (e.isTotp = n.totp),
            (e.pwdChange = !1),
            (e.userChange = !1);
        });
    },
  ),
  module.controller('UserCredentialsDataModalCtrl', (e, r) => {
    (e.credentialData = r), (e.keys = (e) => (e ? Object.keys(e) : []));
  }),
  module.controller('UserFederationCtrl', (e, r, n, i, t, o, s, a, l) => {
    console.log('UserFederationCtrl ++++****'),
      (e.realm = i),
      (e.providers =
        t.componentTypes['org.keycloak.storage.UserStorageProvider']),
      (e.instancesLoaded = !1),
      e.providers || (e.providers = []),
      (e.addProvider = (e) => {
        console.log(`Add provider: ${e.id}`),
          r.url(`/create/user-storage/${i.realm}/providers/${e.id}`);
      }),
      (e.getInstanceLink = (e) =>
        `/realms/${i.realm}/user-storage/providers/${e.providerId}/${e.id}`),
      (e.getInstanceName = (e) => e.name),
      (e.getInstanceProvider = (e) => e.providerId),
      (e.isProviderEnabled = (e) =>
        !e.config.enabled || 'true' === e.config.enabled[0]),
      (e.getInstancePriority = (e) =>
        e.config.priority
          ? +e.config.priority[0]
          : (console.log('getInstancePriority is undefined'), -1)),
      o.query(
        {
          realm: i.realm,
          parent: i.id,
          type: 'org.keycloak.storage.UserStorageProvider',
        },
        (r) => {
          (e.instances = r), (e.instancesLoaded = !0);
        },
      ),
      (e.removeInstance = (e) => {
        a.confirmWithButtonText(
          l.instant('user.storage.remove.confirm.title', { name: e.name }),
          l.instant('user.storage.remove.confirm.message', { name: e.name }),
          l.instant('dialogs.delete.confirm'),
          () => {
            o.remove({ realm: i.realm, componentId: e.id }, () => {
              n.reload(), s.success(l.instant('user.storage.remove.success'));
            });
          },
        );
      });
  }),
  module.controller(
    'GenericUserStorageCtrl',
    (e, r, n, i, _t, o, s, a, l, c, u, d) => {
      console.log('GenericUserStorageCtrl'),
        console.log(`providerId: ${l}`),
        (e.create = !a.providerId),
        console.log(`create: ${e.create}`);
      var m = s.componentTypes['org.keycloak.storage.UserStorageProvider'];
      console.log(`providers length ${m.length}`);
      for (var p = null, f = 0; f < m.length; f++) {
        var g = m[f];
        if ((console.log(`provider: ${g.id}`), g.id === l)) {
          (e.providerFactory = g), (p = g);
          break;
        }
      }
      function h(r) {
        u.sync.save(
          { action: r, realm: e.realm.realm, componentId: e.instance.id },
          {},
          (e) => {
            i.reload(),
              n.success(
                d.instant('user.storage.sync.success', { status: e.status }),
              );
          },
          () => {
            i.reload(), n.error(d.instant('user.storage.sync.error'));
          },
        );
      }
      (e.showSync = !1),
        (e.changed = !1),
        console.log(`providerFactory: ${p.id}`),
        (() => {
          if (e.create) {
            if (
              ((e.changed = !0),
              (a.name = p.id),
              (a.providerId = p.id),
              (a.providerType = 'org.keycloak.storage.UserStorageProvider'),
              (a.parentId = o.id),
              (a.config = {}),
              (a.config.priority = ['0']),
              (a.config.enabled = ['true']),
              (e.fullSyncEnabled = !1),
              (e.changedSyncEnabled = !1),
              p.metadata.synchronizable &&
                ((a.config.fullSyncPeriod = ['-1']),
                (a.config.changedSyncPeriod = ['-1'])),
              (a.config.cachePolicy = ['DEFAULT']),
              (a.config.evictionDay = ['']),
              (a.config.evictionHour = ['']),
              (a.config.evictionMinute = ['']),
              (a.config.maxLifespan = ['']),
              p.properties)
            )
              for (var r = 0; r < p.properties.length; r++) {
                (n = p.properties[r]).defaultValue
                  ? (a.config[n.name] = [n.defaultValue])
                  : (a.config[n.name] = ['']);
              }
          } else if (
            ((e.changed = !1),
            (e.fullSyncEnabled =
              a.config.fullSyncPeriod && a.config.fullSyncPeriod[0] > 0),
            (e.changedSyncEnabled =
              a.config.changedSyncPeriod && a.config.changedSyncPeriod[0] > 0),
            p.metadata.synchronizable &&
              (a.config.fullSyncPeriod ||
                (console.log('setting to -1'),
                (a.config.fullSyncPeriod = ['-1'])),
              a.config.changedSyncPeriod ||
                (console.log('setting to -1'),
                (a.config.changedSyncPeriod = ['-1']))),
            a.config.enabled || (a.config.enabled = ['true']),
            a.config.cachePolicy || (a.config.cachePolicy = ['DEFAULT']),
            a.config.evictionDay || (a.config.evictionDay = ['']),
            a.config.evictionHour || (a.config.evictionHour = ['']),
            a.config.evictionMinute || (a.config.evictionMinute = ['']),
            a.config.maxLifespan || (a.config.maxLifespan = ['']),
            a.config.priority || (a.config.priority = ['0']),
            p.properties)
          )
            for (r = 0; r < p.properties.length; r++) {
              var n = p.properties[r];
              a.config[n.name] || (a.config[n.name] = ['']);
            }
          p.metadata.synchronizable &&
            (a.config?.importEnabled
              ? (e.showSync = 'true' === a.config.importEnabled[0])
              : (e.showSync = !0));
        })(),
        (e.instance = angular.copy(a)),
        (e.realm = o),
        e.$watch(
          'instance',
          () => {
            angular.equals(e.instance, a) || (e.changed = !0);
          },
          !0,
        ),
        e.$watch('fullSyncEnabled', (r, n) => {
          n !== r &&
            ((e.instance.config.fullSyncPeriod[0] = e.fullSyncEnabled
              ? '604800'
              : '-1'),
            (e.changed = !0));
        }),
        e.$watch('changedSyncEnabled', (r, n) => {
          n !== r &&
            ((e.instance.config.changedSyncPeriod[0] = e.changedSyncEnabled
              ? '86400'
              : '-1'),
            (e.changed = !0));
        }),
        (e.save = () => {
          console.log('save provider'),
            (e.changed = !1),
            e.create
              ? (console.log('saving new provider'),
                c.save({ realm: o.realm }, e.instance, (_i, t) => {
                  var s = t().location,
                    a = s.substring(s.lastIndexOf('/') + 1);
                  r.url(
                    `/realms/${o.realm}/user-storage/providers/${e.instance.providerId}/${a}`,
                  ),
                    n.success(d.instant('user.storage.create.success'));
                }))
              : (console.log('update existing provider'),
                c.update(
                  { realm: o.realm, componentId: a.id },
                  e.instance,
                  () => {
                    i.reload(),
                      n.success(d.instant('user.storage.edit.success'));
                  },
                ));
        }),
        (e.reset = () => {
          i.reload();
        }),
        (e.cancel = () => {
          console.log('cancel'),
            e.create ? r.url(`/realms/${o.realm}/user-federation`) : i.reload();
        }),
        (e.triggerFullSync = () => {
          console.log('GenericCtrl: triggerFullSync'), h('triggerFullSync');
        }),
        (e.triggerChangedUsersSync = () => {
          console.log('GenericCtrl: triggerChangedUsersSync'),
            h('triggerChangedUsersSync');
        }),
        (e.removeImportedUsers = () => {
          u.removeImportedUsers.save(
            { realm: e.realm.realm, componentId: e.instance.id },
            {},
            (_e) => {
              i.reload(),
                n.success(d.instant('user.storage.remove-users.success'));
            },
            () => {
              i.reload(), n.error(d.instant('user.storage.remove-users.error'));
            },
          );
        }),
        (e.unlinkUsers = () => {
          u.unlinkUsers.save(
            { realm: e.realm.realm, componentId: e.instance.id },
            {},
            (_e) => {
              i.reload(), n.success(d.instant('user.storage.unlink.success'));
            },
            () => {
              i.reload(), n.error(d.instant('user.storage.unlink.error'));
            },
          );
        });
    },
  ),
  module.controller(
    'UserGroupMembershipCtrl',
    (e, r, n, i, t, o, s, a, l, c, u, d) => {
      (e.realm = n),
        (e.user = i),
        (e.groupList = []),
        (e.allGroupMemberships = []),
        (e.groupMemberships = []),
        (e.tree = []),
        (e.membershipTree = []),
        (e.searchCriteria = ''),
        (e.searchCriteriaMembership = ''),
        (e.currentPage = 1),
        (e.currentMembershipPage = 1),
        (e.currentPageInput = e.currentPage),
        (e.currentMembershipPageInput = e.currentMembershipPage),
        (e.pageSize = 20),
        (e.numberOfPages = 1),
        (e.numberOfMembershipPages = 1);
      var m = (s) => {
          e.currentMembershipPageInput = e.currentMembershipPage;
          var l = e.currentMembershipPage * e.pageSize - e.pageSize,
            c = { realm: n.realm, userId: i.id, first: l, max: e.pageSize },
            u = { realm: n.realm, userId: i.id };
          angular.isDefined(s) && '' !== s && ((c.search = s), (u.search = s));
          var m = r.defer();
          t.query(
            c,
            (e) => {
              m.resolve(e);
            },
            () => {
              m.reject(d.instant('user.groups.fetch.error', { params: c }));
            },
          );
          var p = r.defer();
          return (
            m.promise.then(
              (r) => {
                (e.groupMemberships = r),
                  o.query(
                    u,
                    (e) => {
                      p.resolve(e);
                    },
                    () => {
                      p.reject(
                        d.instant('user.groups.fetch.error', { params: u }),
                      );
                    },
                  ),
                  p.promise.then(
                    (r) => {
                      angular.isDefined(r.count) && r.count > e.pageSize
                        ? (e.numberOfMembershipPages = Math.ceil(
                            r.count / e.pageSize,
                          ))
                        : (e.numberOfMembershipPages = 1),
                        parseInt(e.currentMembershipPage, 10) >
                          e.numberOfMembershipPages &&
                          (e.currentMembershipPage = e.numberOfMembershipPages);
                    },
                    (e) => {
                      a.error(e);
                    },
                  );
              },
              (e) => {
                a.error(e);
              },
            ),
            p.promise
          );
        },
        p = (i) => {
          e.currentPageInput = e.currentPage;
          var t = e.currentPage * e.pageSize - e.pageSize,
            o = { realm: n.realm, first: t, max: e.pageSize },
            s = { realm: n.realm, top: 'true' };
          angular.isDefined(i) && '' !== i && ((o.search = i), (s.search = i));
          var m = r.defer();
          l.query(
            o,
            (e) => {
              m.resolve(e);
            },
            () => {
              m.reject(d.instant('user.groups.fetch.error', { params: o }));
            },
          );
          var p = r.defer();
          return (
            m.promise.then(
              (r) => {
                (e.groupList = u.sortGroups('name', r)),
                  c.query(
                    s,
                    (e) => {
                      p.resolve(e);
                    },
                    () => {
                      p.reject(
                        d.instant('user.groups.fetch.error', { params: s }),
                      );
                    },
                  ),
                  p.promise.then(
                    (r) => {
                      angular.isDefined(r.count) && r.count > e.pageSize
                        ? (e.numberOfPages = Math.ceil(r.count / e.pageSize))
                        : (e.numberOfPages = 1);
                    },
                    (e) => {
                      a.error(e);
                    },
                  );
              },
              (e) => {
                a.error(e);
              },
            ),
            p.promise
          );
        };
      (e.clearSearchMembership = () => {
        (e.searchCriteriaMembership = ''),
          1 === parseInt(e.currentMembershipPage, 10)
            ? m()
            : (e.currentMembershipPage = 1);
      }),
        (e.searchGroupMembership = () => {
          1 === parseInt(e.currentMembershipPage, 10)
            ? m(e.searchCriteriaMembership)
            : (e.currentMembershipPage = 1);
        }),
        m().then(() => {
          p(),
            (() => {
              var o = { realm: n.realm, userId: i.id },
                s = r.defer();
              t.query(
                o,
                (e) => {
                  s.resolve(e);
                },
                () => {
                  s.reject(
                    d.instant('user.groups.fetch.all.error', { params: o }),
                  );
                },
              ),
                s.promise.then(
                  (r) => {
                    for (var n = 0; n < r.length; n++)
                      e.allGroupMemberships.push(r[n]), e.getGroupClass(r[n]);
                  },
                  (e) => {
                    a.error(e);
                  },
                ),
                s.promise;
            })();
        }),
        e.$watch('currentPage', (r, n) => {
          parseInt(r, 10) !== parseInt(n, 10) && p(e.searchCriteria);
        }),
        e.$watch('currentMembershipPage', (r, n) => {
          parseInt(r, 10) !== parseInt(n, 10) && m(e.searchCriteriaMembership);
        }),
        (e.clearSearch = () => {
          (e.searchCriteria = ''),
            1 === parseInt(e.currentPage, 10) ? p() : (e.currentPage = 1);
        }),
        (e.searchGroup = () => {
          1 === parseInt(e.currentPage, 10)
            ? p(e.searchCriteria)
            : (e.currentPage = 1);
        }),
        (e.joinGroup = () => {
          e.tree.currentNode
            ? f(e.tree.currentNode)
              ? a.error(d.instant('user.groups.join.error.already-added'))
              : s.update(
                  {
                    realm: n.realm,
                    userId: i.id,
                    groupId: e.tree.currentNode.id,
                  },
                  () => {
                    e.allGroupMemberships.push(e.tree.currentNode),
                      m(e.searchCriteriaMembership),
                      a.success(d.instant('user.groups.join.success'));
                  },
                )
            : a.error(d.instant('user.groups.join.error.no-group-selected'));
        }),
        (e.leaveGroup = () => {
          e.membershipTree.currentNode
            ? s.remove(
                {
                  realm: n.realm,
                  userId: i.id,
                  groupId: e.membershipTree.currentNode.id,
                },
                () => {
                  removeGroupMember(
                    e.allGroupMemberships,
                    e.membershipTree.currentNode,
                  ),
                    m(e.searchCriteriaMembership),
                    a.success(d.instant('user.groups.leave.success'));
                },
              )
            : a.error(d.instant('user.groups.leave.error.no-group-selected'));
        });
      var f = (r) => {
        for (var n = 0; n < e.allGroupMemberships.length; n++) {
          var i = e.allGroupMemberships[n];
          if (r.id === i.id) return !0;
        }
        return !1;
      };
      (e.getGroupClass = (e) =>
        'realm' === e.id
          ? 'pficon pficon-users'
          : f(e)
            ? 'normal deactivate'
            : ((e) =>
                  'realm' !== e.id &&
                  (!e.subGroups || 0 === e.subGroups.length))(e)
              ? 'normal'
              : e.subGroups.length && e.collapsed
                ? 'collapsed'
                : e.subGroups.length && !e.collapsed
                  ? 'expanded'
                  : 'collapsed'),
        (e.getSelectedClass = (r) =>
          r.selected
            ? f(r)
              ? 'deactivate_selected'
              : 'selected'
            : e.cutNode && e.cutNode.id === r.id
              ? 'cut'
              : void 0);
    },
  ),
  module.controller(
    'LDAPUserStorageCtrl',
    (e, r, n, i, _t, o, s, a, l, c, u, d) => {
      console.log('LDAPUserStorageCtrl');
      var m = 'ldap';
      console.log('providerId: ldap'),
        (e.create = !a.providerId),
        console.log(`create: ${e.create}`);
      var p = s.componentTypes['org.keycloak.storage.UserStorageProvider'];
      console.log(`providers length ${p.length}`);
      for (var f = null, g = 0; g < p.length; g++) {
        var h = p[g];
        if ((console.log(`provider: ${h.id}`), h.id === m)) {
          (e.providerFactory = h), (f = h);
          break;
        }
      }
      (e.provider = a),
        (e.showSync = !1),
        'community' === s.profileInfo.name
          ? (e.ldapVendors = [
              { id: 'ad', name: 'Active Directory' },
              { id: 'rhds', name: 'Red Hat Directory Server' },
              { id: 'tivoli', name: 'Tivoli' },
              { id: 'edirectory', name: 'Novell eDirectory' },
              { id: 'other', name: 'Other' },
            ])
          : (e.ldapVendors = [
              { id: 'ad', name: 'Active Directory' },
              { id: 'rhds', name: 'Red Hat Directory Server' },
            ]),
        (e.authTypes = [
          { id: 'none', name: 'none' },
          { id: 'simple', name: 'simple' },
        ]),
        (e.searchScopes = [
          { id: '1', name: 'One Level' },
          { id: '2', name: 'Subtree' },
        ]),
        (e.useTruststoreOptions = [
          { id: 'always', name: 'Always' },
          { id: 'ldapsOnly', name: 'Only for ldaps' },
          { id: 'never', name: 'Never' },
        ]);
      var v = '1000';
      function y(r) {
        c.sync.save(
          { action: r, realm: e.realm.realm, componentId: e.instance.id },
          {},
          (e) => {
            i.reload(),
              n.success(`Sync of users finished successfully. ${e.status}`);
          },
          () => {
            i.reload(), n.error('Error during sync of users');
          },
        );
      }
      console.log(`providerFactory: ${f.id}`),
        (e.changed = !1),
        (() => {
          if (e.create) {
            if (
              ((e.changed = !0),
              (a.name = 'ldap'),
              (a.providerId = 'ldap'),
              (a.providerType = 'org.keycloak.storage.UserStorageProvider'),
              (a.parentId = o.id),
              (a.config = {}),
              (a.config.enabled = ['true']),
              (a.config.priority = ['0']),
              (e.fullSyncEnabled = !1),
              (e.changedSyncEnabled = !1),
              (a.config.fullSyncPeriod = ['-1']),
              (a.config.changedSyncPeriod = ['-1']),
              (a.config.cachePolicy = ['DEFAULT']),
              (a.config.evictionDay = ['']),
              (a.config.evictionHour = ['']),
              (a.config.evictionMinute = ['']),
              (a.config.maxLifespan = ['']),
              (a.config.batchSizeForSync = [v]),
              f.properties)
            )
              for (var r = 0; r < f.properties.length; r++) {
                (n = f.properties[r]).defaultValue
                  ? (a.config[n.name] = [n.defaultValue])
                  : (a.config[n.name] = ['']);
              }
          } else {
            if (
              ((e.changed = !1),
              (e.fullSyncEnabled =
                a.config.fullSyncPeriod && a.config.fullSyncPeriod[0] > 0),
              (e.changedSyncEnabled =
                a.config.changedSyncPeriod &&
                a.config.changedSyncPeriod[0] > 0),
              a.config.fullSyncPeriod ||
                (console.log('setting to -1'),
                (a.config.fullSyncPeriod = ['-1'])),
              a.config.enabled || (a.config.enabled = ['true']),
              a.config.changedSyncPeriod ||
                (console.log('setting to -1'),
                (a.config.changedSyncPeriod = ['-1'])),
              a.config.cachePolicy || (a.config.cachePolicy = ['DEFAULT']),
              a.config.evictionDay || (a.config.evictionDay = ['']),
              a.config.evictionHour || (a.config.evictionHour = ['']),
              a.config.evictionMinute || (a.config.evictionMinute = ['']),
              a.config.maxLifespan || (a.config.maxLifespan = ['']),
              a.config.priority || (a.config.priority = ['0']),
              a.config.importEnabled || (a.config.importEnabled = ['true']),
              f.properties)
            )
              for (r = 0; r < f.properties.length; r++) {
                var n = f.properties[r];
                a.config[n.name] ||
                  (n.defaultValue
                    ? (a.config[n.name] = [n.defaultValue])
                    : (a.config[n.name] = ['']));
              }
            for (r = 0; r < e.ldapVendors.length; r++)
              e.ldapVendors[r].id === a.config.vendor[0] &&
                (e.vendorName = e.ldapVendors[r].name);
          }
          a.config?.importEnabled
            ? (e.showSync = 'true' === a.config.importEnabled[0])
            : (e.showSync = !0),
            (e.lastVendor = a.config.vendor[0]);
        })(),
        (e.instance = angular.copy(a)),
        (e.realm = o),
        e.$watch(
          'instance',
          () => {
            if (
              (angular.equals(e.instance, a) || (e.changed = !0),
              !angular.equals(e.instance.config.vendor[0], e.lastVendor))
            ) {
              console.log(
                `LDAP vendor changed. Previous=${e.lastVendor} New=${e.instance.config.vendor[0]}`,
              ),
                (e.lastVendor = e.instance.config.vendor[0]),
                'ad' === e.lastVendor
                  ? ((e.instance.config.usernameLDAPAttribute[0] = 'cn'),
                    (e.instance.config.userObjectClasses[0] =
                      'person, organizationalPerson, user'))
                  : ((e.instance.config.usernameLDAPAttribute[0] = 'uid'),
                    (e.instance.config.userObjectClasses[0] =
                      'inetOrgPerson, organizationalPerson')),
                (e.instance.config.rdnLDAPAttribute[0] =
                  e.instance.config.usernameLDAPAttribute[0]);
              e.instance.config.uuidLDAPAttribute[0] = {
                rhds: 'nsuniqueid',
                tivoli: 'uniqueidentifier',
                edirectory: 'guid',
                ad: 'objectGUID',
                other: 'entryUUID',
              }[e.lastVendor];
            }
          },
          !0,
        ),
        e.$watch('fullSyncEnabled', (r, n) => {
          n !== r &&
            ((e.instance.config.fullSyncPeriod[0] = e.fullSyncEnabled
              ? '604800'
              : '-1'),
            (e.changed = !0));
        }),
        e.$watch('changedSyncEnabled', (r, n) => {
          n !== r &&
            ((e.instance.config.changedSyncPeriod[0] = e.changedSyncEnabled
              ? '86400'
              : '-1'),
            (e.changed = !0));
        }),
        (e.save = () => {
          (e.changed = !1),
            e.instance.config.batchSizeForSync &&
            parseInt(e.instance.config.batchSizeForSync[0], 10)
              ? (e.instance.config.batchSizeForSync[0] = parseInt(
                  e.instance.config.batchSizeForSync,
                  10,
                ).toString())
              : (e.instance.config.batchSizeForSync = [v]),
            e.create
              ? l.save({ realm: o.realm }, e.instance, (_i, t) => {
                  var s = t().location,
                    a = s.substring(s.lastIndexOf('/') + 1);
                  r.url(
                    `/realms/${o.realm}/user-storage/providers/${e.instance.providerId}/${a}`,
                  ),
                    n.success('The provider has been created.');
                })
              : l.update(
                  { realm: o.realm, componentId: a.id },
                  e.instance,
                  () => {
                    i.reload(), n.success('The provider has been updated.');
                  },
                );
        }),
        (e.reset = () => {
          i.reload();
        }),
        (e.cancel = () => {
          e.create ? r.url(`/realms/${o.realm}/user-federation`) : i.reload();
        }),
        (e.triggerFullSync = () => {
          console.log('GenericCtrl: triggerFullSync'), y('triggerFullSync');
        }),
        (e.triggerChangedUsersSync = () => {
          console.log('GenericCtrl: triggerChangedUsersSync'),
            y('triggerChangedUsersSync');
        }),
        (e.removeImportedUsers = () => {
          c.removeImportedUsers.save(
            { realm: e.realm.realm, componentId: e.instance.id },
            {},
            (_e) => {
              i.reload(),
                n.success('Remove imported users finished successfully. ');
            },
            () => {
              i.reload(), n.error('Error during remove');
            },
          );
        }),
        (e.unlinkUsers = () => {
          c.unlinkUsers.save(
            { realm: e.realm.realm, componentId: e.instance.id },
            {},
            (_e) => {
              i.reload(), n.success('Unlink of users finished successfully. ');
            },
            () => {
              i.reload(), n.error('Error during unlink');
            },
          );
        });
      var b = (e, r) => ({
        action: e,
        connectionUrl: r.connectionUrl?.[0],
        authType: r.authType?.[0],
        bindDn: r.bindDn?.[0],
        bindCredential: r.bindCredential?.[0],
        useTruststoreSpi: r.useTruststoreSpi?.[0],
        connectionTimeout: r.connectionTimeout?.[0],
        startTls: r.startTls?.[0],
        componentId: a.id,
      });
      (e.testConnection = () => {
        console.log('LDAPCtrl: testConnection'),
          u.save(
            { realm: o.realm },
            b('testConnection', e.instance.config),
            () => {
              n.success('LDAP connection successful.');
            },
            () => {
              n.error(
                'Error when trying to connect to LDAP. See server.log for details.',
              );
            },
          );
      }),
        (e.testAuthentication = () => {
          console.log('LDAPCtrl: testAuthentication'),
            u.save(
              { realm: o.realm },
              b('testAuthentication', e.instance.config),
              () => {
                n.success('LDAP authentication successful.');
              },
              () => {
                n.error(
                  'LDAP authentication failed. See server.log for details',
                );
              },
            );
        }),
        (e.queryAndSetLdapSupportedExtensions = () => {
          console.log('LDAPCtrl: getLdapSupportedExtensions');
          d.post(
            `${authUrl}/admin/realms/${o.realm}/ldap-server-capabilities`,
            b('queryServerCapabilities', e.instance.config),
          ).then(
            (r) => {
              n.success('LDAP supported extensions successfully requested.');
              const i = r.data;
              if (angular.isArray(i)) {
                const r = i.filter((e) => '1.3.6.1.4.1.4203.1.11.1' === e.oid);
                e.instance.config.usePasswordModifyExtendedOp[0] = (
                  r.length > 0
                ).toString();
              }
            },
            () => {
              n.error(
                'Error when trying to request supported extensions of LDAP. See server.log for details.',
              );
            },
          );
        });
    },
  ),
  module.controller('LDAPTabCtrl', (e, r, n, i, t) => {
    r.removeUserFederation = () => {
      e.confirmDelete(r.instance.name, 'ldap provider', () => {
        r.instance.$remove(
          { realm: n.realm.realm, componentId: r.instance.id },
          () => {
            t.url(`/realms/${n.realm.realm}/user-federation`),
              i.success('The provider has been deleted.');
          },
        );
      });
    };
  }),
  module.controller('LDAPMapperListCtrl', (e, _r, _n, _i, _t, o, s, a) => {
    console.log('LDAPMapperListCtrl'),
      (e.realm = o),
      (e.provider = s),
      (e.instance = s),
      (e.mappers = a);
  }),
  module.controller('LDAPMapperCtrl', (e, r, n, i, t, o, s, a, l, c, u, d) => {
    console.log('LDAPMapperCtrl'),
      (e.realm = n),
      (e.provider = i),
      (e.clients = s),
      (e.create = !1),
      (e.changed = !1);
    for (var m = 0; m < t.length; m++)
      if (
        (console.log(`mapper.providerId: ${o.providerId}`),
        console.log(`mapperTypes[i].id ${t[m].id}`),
        t[m].id === o.providerId)
      ) {
        e.mapperType = t[m];
        break;
      }
    if (e.mapperType.properties)
      for (m = 0; m < e.mapperType.properties.length; m++) {
        var p = e.mapperType.properties[m];
        o.config[p.name] ||
          (p.defaultValue
            ? (o.config[p.name] = [p.defaultValue])
            : (o.config[p.name] = ['']));
      }
    function f(r) {
      l.save(
        { direction: r, realm: n.realm, parentId: i.id, mapperId: e.mapper.id },
        {},
        (e) => {
          c.success(`Data synced successfully. ${e.status}`);
        },
        (e) => {
          c.error(e.data.errorMessage);
        },
      );
    }
    (e.mapper = angular.copy(o)),
      e.$watch(
        'mapper',
        () => {
          angular.equals(e.mapper, o) || (e.changed = !0);
        },
        !0,
      ),
      (e.save = () => {
        a.update({ realm: n.realm, componentId: o.id }, e.mapper, () => {
          r.reload(), c.success('The mapper has been updated.');
        });
      }),
      (e.reset = () => {
        (e.mapper = angular.copy(o)), (e.changed = !1);
      }),
      (e.remove = () => {
        u.confirmDelete(e.mapper.name, 'ldap mapper', () => {
          a.remove({ realm: n.realm, componentId: o.id }, () => {
            d.url(`/realms/${n.realm}/ldap-mappers/${i.id}`),
              c.success('The provider has been deleted.');
          });
        });
      }),
      (e.triggerFedToKeycloakSync = () => {
        f('fedToKeycloak');
      }),
      (e.triggerKeycloakToFedSync = () => {
        f('keycloakToFed');
      });
  }),
  module.controller('LDAPMapperCreateCtrl', (e, r, n, i, t, o, s, _a, l) => {
    console.log('LDAPMapperCreateCtrl'),
      (e.realm = r),
      (e.provider = n),
      (e.clients = t),
      (e.create = !0),
      (e.mapper = { config: {} }),
      (e.mapperTypes = i),
      (e.mapperType = null),
      (e.changed = !0),
      e.$watch(
        'mapperType',
        () => {
          if (
            null != e.mapperType &&
            ((e.mapper.config = {}), e.mapperType.properties)
          )
            for (var r = 0; r < e.mapperType.properties.length; r++) {
              var n = e.mapperType.properties[r];
              e.mapper.config[n.name] ||
                (n.defaultValue
                  ? (e.mapper.config[n.name] = [n.defaultValue])
                  : (e.mapper.config[n.name] = ['']));
            }
        },
        !0,
      ),
      (e.save = () => {
        null != e.mapperType
          ? ((e.mapper.providerId = e.mapperType.id),
            (e.mapper.providerType =
              'org.keycloak.storage.ldap.mappers.LDAPStorageMapper'),
            (e.mapper.parentId = n.id),
            e.mapper.config?.role &&
              !Array.isArray(e.mapper.config.role) &&
              (e.mapper.config.role = [e.mapper.config.role]),
            o.save({ realm: r.realm }, e.mapper, (_n, i) => {
              var t = i().location,
                o = t.substring(t.lastIndexOf('/') + 1);
              l.url(
                `/realms/${r.realm}/ldap-mappers/${e.mapper.parentId}/mappers/${o}`,
              ),
                s.success('The mapper has been created.');
            }))
          : s.error('You need to select mapper type!');
      }),
      (e.reset = () => {
        l.url(`/realms/${r.realm}/ldap-mappers/${n.id}`);
      });
  });
