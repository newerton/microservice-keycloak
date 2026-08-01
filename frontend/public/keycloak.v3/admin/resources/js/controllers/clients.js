(Array.prototype.remove = function (e, t) {
  var n = this.slice((t || e) + 1 || this.length);
  return (this.length = e < 0 ? this.length + e : e), this.push.apply(this, n);
}),
  module.controller('ClientTabCtrl', (e, t, n, i, l) => {
    t.removeClient = () => {
      e.confirmDelete(t.client.clientId, 'client', () => {
        t.client.$remove({ realm: n.realm.realm, client: t.client.id }, () => {
          l.url(`/realms/${n.realm.realm}/clients`),
            i.success('The client has been deleted.');
        });
      });
    };
  }),
  module.controller('ClientRoleListCtrl', (e, t, n, i, l, o, r, a) => {
    (e.realm = n),
      (e.roles = []),
      (e.client = i),
      (e.query = {
        realm: n.realm,
        client: e.client.id,
        search: null,
        max: 20,
        first: 0,
      }),
      e.$watch(
        'query.search',
        (_t, _n) => {
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
      (e.removeRole = (e) => {
        a.confirmDelete(e.name, 'role', () => {
          o.remove({ realm: n.realm, role: e.id }, () => {
            t.reload(), r.success('The role has been deleted.');
          });
        });
      });
  }),
  module.controller('ClientCredentialsCtrl', (e, _t, n, i, l, o, r, a, c) => {
    (e.realm = n),
      (e.client = angular.copy(i)),
      (e.clientAuthenticatorProviders = l);
    var s = (t) => {
      switch ((e.clientAuthenticatorConfigPartial, t)) {
        case 'client-secret':
          e.clientAuthenticatorConfigPartial = 'client-credentials-secret.html';
          break;
        case 'client-jwt':
          e.clientAuthenticatorConfigPartial = 'client-credentials-jwt.html';
          break;
        case 'client-secret-jwt':
          e.clientAuthenticatorConfigPartial =
            'client-credentials-secret-jwt.html';
          break;
        case 'client-x509':
          e.clientAuthenticatorConfigPartial = 'client-credentials-x509.html';
          break;
        default:
          (e.currentAuthenticatorConfigProperties = o[t]),
            (e.clientAuthenticatorConfigPartial =
              'client-credentials-generic.html');
      }
    };
    s(i.clientAuthenticatorType),
      e.$watch(
        'client.clientAuthenticatorType',
        () => {
          angular.equals(
            e.client.clientAuthenticatorType,
            i.clientAuthenticatorType,
          ) ||
            r.update({ realm: n.realm, client: i.id }, e.client, () => {
              (e.changed = !1),
                (i = angular.copy(e.client)),
                s(i.clientAuthenticatorType);
            });
        },
        !0,
      ),
      (e.regenerateRegistrationAccessToken = () => {
        a.update(
          { realm: e.realm.realm, client: e.client.id },
          (t) => {
            c.success('The registration access token has been updated.'),
              (e.client.registrationAccessToken = t.registrationAccessToken);
          },
          () => {
            c.error('Failed to update the registration access token');
          },
        );
      });
  }),
  module.controller('ClientSecretCtrl', (e, t, n, i, l) => {
    var o = i.get({ realm: e.realm.realm, client: e.client.id }, () => {
      e.secret = o.value;
    });
    (e.changePassword = () => {
      var t = i.update(
        { realm: e.realm.realm, client: e.client.id },
        () => {
          l.success('The secret has been changed.'), (e.secret = t.value);
        },
        () => {
          l.error('The secret was not changed due to a problem.'),
            (e.secret = 'error');
        },
      );
    }),
      (e.tokenEndpointAuthSigningAlg =
        e.client.attributes['token.endpoint.auth.signing.alg']),
      (e.switchChange = () => {
        e.changed = !0;
      }),
      (e.save = () => {
        (e.client.attributes['token.endpoint.auth.signing.alg'] =
          e.tokenEndpointAuthSigningAlg),
          n.update(
            { realm: e.realm.realm, client: e.client.id },
            e.client,
            () => {
              (e.changed = !1),
                (e.clientCopy = angular.copy(e.client)),
                l.success(
                  'Client authentication configuration has been saved to the client.',
                );
            },
          );
      }),
      e.$watch(
        () => t.path(),
        () => {
          e.path = t.path().substring(1).split('/');
        },
      ),
      (e.cancel = () => {
        t.url(`/realms/${e.realm.realm}/clients/${e.client.id}/credentials`);
      });
  }),
  module.controller('ClientX509Ctrl', (e, t, n, i) => {
    console.log('ClientX509Ctrl invoked'),
      (e.clientCopy = angular.copy(e.client)),
      (e.changed = !1),
      e.$watch(
        'client',
        () => {
          angular.equals(e.client, e.clientCopy) || (e.changed = !0);
        },
        !0,
      ),
      (e.save = () => {
        e.client.attributes['x509.subjectdn']
          ? n.update(
              { realm: e.realm.realm, client: e.client.id },
              e.client,
              () => {
                (e.changed = !1),
                  (e.clientCopy = angular.copy(e.client)),
                  i.success(
                    'Client authentication configuration has been saved to the client.',
                  );
              },
              () => {
                i.error('The SubjectDN was not changed due to a problem.'),
                  (e.subjectdn = 'error');
              },
            )
          : i.error('The SubjectDN must not be empty.');
      }),
      e.$watch(
        () => t.path(),
        () => {
          e.path = t.path().substring(1).split('/');
        },
      ),
      (e.reset = () => {
        (e.client.attributes['x509.subjectdn'] =
          e.clientCopy.attributes['x509.subjectdn']),
          t.url(`/realms/${e.realm.realm}/clients/${e.client.id}/credentials`);
      });
  }),
  module.controller('ClientSignedJWTCtrl', (e, t, n, i, l, o) => {
    var r = i.get(
      {
        realm: e.realm.realm,
        client: e.client.id,
        attribute: 'jwt.credential',
      },
      () => {
        e.signingKeyInfo = r;
      },
    );
    console.log('ClientSignedJWTCtrl invoked'),
      (e.clientCopy = angular.copy(e.client)),
      (e.changed = !1),
      e.$watch(
        'client',
        () => {
          angular.equals(e.client, e.clientCopy) || (e.changed = !0);
        },
        !0,
      ),
      (e.tokenEndpointAuthSigningAlg =
        e.client.attributes['token.endpoint.auth.signing.alg']),
      e.client.attributes['use.jwks.url'] &&
        ('true' === e.client.attributes['use.jwks.url']
          ? (e.useJwksUrl = !0)
          : (e.useJwksUrl = !1)),
      (e.switchChange = () => {
        e.changed = !0;
      }),
      (e.save = () => {
        (e.client.attributes['token.endpoint.auth.signing.alg'] =
          e.tokenEndpointAuthSigningAlg),
          1 === e.useJwksUrl
            ? (e.client.attributes['use.jwks.url'] = 'true')
            : (e.client.attributes['use.jwks.url'] = 'false'),
          n.update(
            { realm: e.realm.realm, client: e.client.id },
            e.client,
            () => {
              (e.changed = !1),
                (e.clientCopy = angular.copy(e.client)),
                l.success(
                  'Client authentication configuration has been saved to the client.',
                );
            },
          );
      }),
      (e.importCertificate = () => {
        t.url(
          `/realms/${e.realm.realm}/clients/${e.client.id}/credentials/client-jwt/Signing/import/jwt.credential`,
        );
      }),
      (e.generateSigningKey = () => {
        t.url(
          `/realms/${e.realm.realm}/clients/${e.client.id}/credentials/client-jwt/Signing/export/jwt.credential`,
        );
      }),
      (e.reset = () => {
        o.reload();
      });
  }),
  module.controller('ClientGenericCredentialsCtrl', (e, _t, n, i) => {
    console.log('ClientGenericCredentialsCtrl invoked'),
      (e.clientCopy = angular.copy(e.client)),
      (e.changed = !1),
      e.$watch(
        'client',
        () => {
          angular.equals(e.client, e.clientCopy) || (e.changed = !0);
        },
        !0,
      ),
      (e.save = () => {
        n.update(
          { realm: e.realm.realm, client: e.client.id },
          e.client,
          () => {
            (e.changed = !1),
              (e.clientCopy = angular.copy(e.client)),
              i.success(
                'Client authentication configuration has been saved to the client.',
              );
          },
        );
      }),
      (e.reset = () => {
        (e.client = angular.copy(e.clientCopy)), (e.changed = !1);
      });
  }),
  module.controller(
    'ClientIdentityProviderCtrl',
    (e, _t, n, l, o, r, _t, a) => {
      (e.realm = l), (e.client = angular.copy(o));
      if (e.client.identityProviders)
        for (
          e.client.identityProviders.length, i = 0;
          i < e.client.identityProviders.length;
          i++
        ) {
          (u = e.client.identityProviders[i]).retrieveToken &&
            (u.retrieveToken = u.retrieveToken.toString());
        }
      else e.client.identityProviders = [];
      e.identityProviders = [];
      var c = [];
      for (j = 0; j < l.identityProviders.length; j++) {
        var s = l.identityProviders[j],
          u = null;
        for (i = 0; i < e.client.identityProviders.length; i++)
          if ((u = e.client.identityProviders[i])) {
            if (u.id === s.id) {
              (e.identityProviders[i] = {}),
                (e.identityProviders[i].identityProvider = s),
                (e.identityProviders[i].retrieveToken = u.retrieveToken);
              break;
            }
            u = null;
          }
        null == u && c.push(s);
      }
      for (j = 0; j < c.length; j++) {
        s = c[j];
        var d = {};
        (d.identityProvider = s),
          (d.retrieveToken = 'false'),
          e.identityProviders.push(d);
        var p = {};
        (p.id = s.id),
          (p.retrieveToken = 'false'),
          e.client.identityProviders.push(p);
      }
      var m = angular.copy(e.client);
      (e.save = () => {
        r.update({ realm: l.realm, client: o.id }, e.client, () => {
          (e.changed = !1),
            n.reload(),
            a.success('Your changes have been saved to the client.');
        });
      }),
        (e.reset = () => {
          (e.client = angular.copy(m)), (e.changed = !1);
        }),
        e.$watch(
          'client',
          () => {
            angular.equals(e.client, m) || (e.changed = !0);
          },
          !0,
        );
    },
  ),
  module.controller('ClientSamlKeyCtrl', (e, t, _n, _i, l, o, r, a, _c, s) => {
    (e.realm = l), (e.client = o);
    var u = r.get(
      { realm: l.realm, client: o.id, attribute: 'saml.signing' },
      () => {
        e.signingKeyInfo = u;
      },
    );
    (e.generateSigningKey = () => {
      var t = a.generate(
        { realm: l.realm, client: o.id, attribute: 'saml.signing' },
        () => {
          s.success('Signing key has been regenerated.'),
            (e.signingKeyInfo = t);
        },
        () => {
          s.error('Signing key was not regenerated.');
        },
      );
    }),
      (e.importSigningKey = () => {
        t.url(
          `/realms/${l.realm}/clients/${o.id}/saml/Signing/import/saml.signing`,
        );
      }),
      (e.exportSigningKey = () => {
        t.url(
          `/realms/${l.realm}/clients/${o.id}/saml/Signing/export/saml.signing`,
        );
      });
    var d = r.get(
      { realm: l.realm, client: o.id, attribute: 'saml.encryption' },
      () => {
        e.encryptionKeyInfo = d;
      },
    );
    (e.generateEncryptionKey = () => {
      var t = a.generate(
        { realm: l.realm, client: o.id, attribute: 'saml.encryption' },
        () => {
          s.success('Encryption key has been regenerated.'),
            (e.encryptionKeyInfo = t);
        },
        () => {
          s.error('Encryption key was not regenerated.');
        },
      );
    }),
      (e.importEncryptionKey = () => {
        t.url(
          `/realms/${l.realm}/clients/${o.id}/saml/Encryption/import/saml.encryption`,
        );
      }),
      (e.exportEncryptionKey = () => {
        t.url(
          `/realms/${l.realm}/clients/${o.id}/saml/Encryption/export/saml.encryption`,
        );
      }),
      e.$watch(
        () => t.path(),
        () => {
          e.path = t.path().substring(1).split('/');
        },
      );
  }),
  module.controller(
    'ClientCertificateImportCtrl',
    (e, t, _n, i, l, o, r, a, _c, _s, _u, d) => {
      console.log(`callingContext: ${r}`);
      var p = a.keyType,
        m = a.attribute;
      if (((e.realm = l), (e.client = o), (e.keyType = p), 'saml' === r))
        var f = `${authUrl}/admin/realms/${l.realm}/clients/${o.id}/certificates/${m}/upload`,
          g = `/realms/${l.realm}/clients/${o.id}/saml/keys`;
      else if ('jwt-credentials' === r)
        (f = `${authUrl}/admin/realms/${l.realm}/clients/${o.id}/certificates/${m}/upload-certificate`),
          (g = `/realms/${l.realm}/clients/${o.id}/credentials`);
      (e.files = []),
        (e.onFileSelect = (t) => {
          e.files = t;
        }),
        (e.cancel = () => {
          t.url(g);
        }),
        (e.keyFormats = ['JKS', 'PKCS12', 'Certificate PEM']),
        'jwt-credentials' === r &&
          (e.keyFormats.push('Public Key PEM'),
          e.keyFormats.push('JSON Web Key Set')),
        (e.hideKeystoreSettings = () =>
          'Certificate PEM' === e.uploadKeyFormat ||
          'Public Key PEM' === e.uploadKeyFormat ||
          'JSON Web Key Set' === e.uploadKeyFormat),
        (e.uploadKeyFormat = e.keyFormats[0]),
        (e.uploadFile = () => {
          for (var n = 0; n < e.files.length; n++) {
            var l = e.files[n];
            e.upload = i
              .upload({
                url: f,
                data: {
                  keystoreFormat: e.uploadKeyFormat,
                  keyAlias: e.uploadKeyAlias,
                  keyPassword: e.uploadKeyPassword,
                  storePassword: e.uploadStorePassword,
                },
                file: l,
              })
              .then((_e, _n, _i) => {
                d.success('Keystore uploaded successfully.'), t.url(g);
              });
          }
        }),
        e.$watch(
          () => t.path(),
          () => {
            e.path = t.path().substring(1).split('/');
          },
        );
    },
  ),
  module.controller(
    'ClientCertificateExportCtrl',
    (e, t, n, _i, l, o, r, a, c, _s, _u, d) => {
      var p = a.keyType,
        m = a.attribute;
      if (((e.realm = l), (e.client = o), (e.keyType = p), 'saml' === r))
        var f = `${authUrl}/admin/realms/${l.realm}/clients/${o.id}/certificates/${m}/download`,
          g = !0;
      else if ('jwt-credentials' === r)
        (f = `${authUrl}/admin/realms/${l.realm}/clients/${o.id}/certificates/${m}/generate-and-download`),
          (g = !1);
      var h = {
        keyAlias: o.clientId,
        realmAlias: l.realm,
        realmCertificate: g,
      };
      e.keyFormats = ['JKS', 'PKCS12'];
      var y = c.get({ realm: l.realm, client: o.id, attribute: m }, () => {
        e.keyInfo = y;
      });
      (e.jks = h),
        (e.jks.format = e.keyFormats[0]),
        (e.download = () => {
          n({
            url: f,
            method: 'POST',
            responseType: 'arraybuffer',
            data: e.jks,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/octet-stream',
            },
          })
            .then((n) => {
              var i = new Blob([n.data], { type: 'application/octet-stream' }),
                a = '.jks';
              'PKCS12' === e.jks.format && (a = '.p12'),
                'jwt-credentials' === r &&
                  (t.url(`/realms/${l.realm}/clients/${o.id}/credentials`),
                  d.success(
                    'New keypair and certificate generated successfully. Download keystore file',
                  )),
                saveAs(i, `keystore${a}`);
            })
            .catch((e) => {
              var t = 'Error downloading';
              try {
                var n = JSON.parse(
                  String.fromCharCode.apply(null, new Uint8Array(e.data)),
                );
                t = n.error_description ? n.error_description : t;
              } catch (_i) {}
              d.error(t);
            });
        }),
        e.$watch(
          () => t.path(),
          () => {
            e.path = t.path().substring(1).split('/');
          },
        ),
        (e.cancel = () => {
          t.url(`/realms/${l.realm}/clients/${o.id}/credentials`);
        });
    },
  ),
  module.controller('ClientSessionsCtrl', (e, t, n, i, l) => {
    (e.realm = t),
      (e.count = n.count),
      (e.sessions = []),
      (e.client = i),
      (e.page = 0),
      (e.query = { realm: t.realm, client: e.client.id, max: 5, first: 0 }),
      (e.firstPage = () => {
        (e.query.first = 0),
          e.query.first < 0 && (e.query.first = 0),
          e.loadUsers();
      }),
      (e.previousPage = () => {
        (e.query.first -= parseInt(e.query.max, 10)),
          e.query.first < 0 && (e.query.first = 0),
          e.loadUsers();
      }),
      (e.nextPage = () => {
        (e.query.first += parseInt(e.query.max, 10)), e.loadUsers();
      }),
      (e.toDate = (e) => new Date(e)),
      (e.loadUsers = () => {
        l.query(e.query, (t) => {
          e.sessions = t;
        });
      });
  }),
  module.controller('ClientOfflineSessionsCtrl', (e, t, n, i, l) => {
    (e.realm = t),
      (e.count = n.count),
      (e.sessions = []),
      (e.client = i),
      (e.page = 0),
      (e.query = { realm: t.realm, client: e.client.id, max: 5, first: 0 }),
      (e.firstPage = () => {
        (e.query.first = 0),
          e.query.first < 0 && (e.query.first = 0),
          e.loadUsers();
      }),
      (e.previousPage = () => {
        (e.query.first -= parseInt(e.query.max, 10)),
          e.query.first < 0 && (e.query.first = 0),
          e.loadUsers();
      }),
      (e.nextPage = () => {
        (e.query.first += parseInt(e.query.max, 10)), e.loadUsers();
      }),
      (e.toDate = (e) => new Date(e)),
      (e.loadUsers = () => {
        l.query(e.query, (t) => {
          e.sessions = t;
        });
      });
  }),
  module.controller(
    'ClientRoleDetailCtrl',
    (e, t, n, i, l, o, r, _a, c, s, u, d, p, m, f, g, h) => {
      (e.realm = n),
        (e.client = i),
        (e.role = angular.copy(l)),
        (e.create = !l.name),
        (e.changed = e.create),
        (e.save = () => {
          !(() => {
            var t = e.role.attributes;
            for (var n in t)
              if ('string' === typeof t[n]) {
                var i = t[n].split('##');
                t[n] = i;
              }
          })(),
            e.create
              ? c.save({ realm: n.realm, client: i.id }, e.role, (_t, _o) => {
                  (e.changed = !1),
                    ((e) => {
                      var t = e.attributes;
                      for (var n in t)
                        if ('object' === typeof t[n]) {
                          var i = t[n].join('##');
                          t[n] = i;
                        }
                    })(e.role),
                    (l = angular.copy(e.role)),
                    c.get(
                      { realm: n.realm, client: i.id, role: l.name },
                      (e) => {
                        var t = e.id;
                        m.url(`/realms/${n.realm}/clients/${i.id}/roles/${t}`),
                          g.success('The role has been created.');
                      },
                    );
                })
              : e.update();
        }),
        (e.remove = () => {
          f.confirmDelete(e.role.name, 'role', () => {
            e.role.$remove(
              { realm: n.realm, client: i.id, role: e.role.id },
              () => {
                m.url(`/realms/${n.realm}/clients/${i.id}/roles`),
                  g.success('The role has been deleted.');
              },
            );
          });
        }),
        (e.cancel = () => {
          m.url(`/realms/${n.realm}/clients/${i.id}/roles`);
        }),
        (e.addAttribute = () => {
          (e.role.attributes[e.newAttribute.key] = e.newAttribute.value),
            delete e.newAttribute;
        }),
        (e.removeAttribute = (t) => {
          delete e.role.attributes[t];
        }),
        roleControl(e, t, n, l, o, r, c, s, u, d, p, m, g, f, h);
    },
  ),
  module.controller('ClientRoleMembersCtrl', (e, t, n, i, l, _o, _r, _a) => {
    (e.realm = t),
      (e.page = 0),
      (e.role = i),
      (e.client = n),
      (e.query = {
        realm: t.realm,
        role: i.name,
        client: n.id,
        max: 5,
        first: 0,
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
        (e.searchLoaded = !1),
          (e.users = l.query(e.query, () => {
            console.log('search loaded'),
              (e.searchLoaded = !0),
              (e.lastSearch = e.query.search);
          }));
      }),
      e.searchQuery();
  }),
  module.controller('ClientImportCtrl', (e, t, n, i, _l, o) => {
    (e.realm = i),
      (e.files = []),
      (e.onFileSelect = (t) => {
        e.files = t;
      }),
      (e.clearFileSelect = () => {
        e.files = null;
      }),
      (e.uploadFile = () => {
        for (var l = 0; l < e.files.length; l++) {
          var r = e.files[l];
          e.upload = n
            .upload({
              url: `${authUrl}/admin/realms/${i.realm}/client-importers/${e.configFormat.id}/upload`,
              data: { myObj: '' },
              file: r,
            })
            .success((_e, _n, _l) => {
              o.success('Uploaded successfully.'),
                t.url(`/realms/${i.realm}/clients`);
            })
            .error(() => {
              o.error('The file can not be uploaded. Please verify the file.');
            });
        }
      }),
      e.$watch(
        () => t.path(),
        () => {
          e.path = t.path().substring(1).split('/');
        },
      );
  }),
  module.controller('ClientListCtrl', (e, t, n, i, l, o, r) => {
    (e.init = () => {
      (e.realm = t),
        (e.searchLoaded = !0),
        (i.query.realm = t.realm),
        (e.query = i.query),
        i.isFirstSearch
          ? ((e.query.clientId = null), e.firstPage())
          : e.searchQuery();
    }),
      (e.searchQuery = () => {
        console.log('query.search: ', e.query),
          (e.searchLoaded = !1),
          (e.clients = n.query(e.query, () => {
            (e.searchLoaded = !0),
              (e.lastSearch = e.query.search),
              (i.isFirstSearch = !1);
          }));
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
      (e.removeClient = (e) => {
        o.confirmDelete(e.clientId, 'client', () => {
          n.remove({ realm: t.realm, client: e.id }, () => {
            l.reload(), r.success('The client has been deleted.');
          });
        });
      }),
      (e.exportClient = (e) => {
        var t = angular.copy(e);
        if ((delete t.id, t.protocolMappers))
          for (var n = 0; n < t.protocolMappers.length; n++)
            delete t.protocolMappers[n].id;
        saveAs(
          new Blob([angular.toJson(t, 4)], { type: 'application/json' }),
          `${t.clientId}.json`,
        );
      });
  }),
  module.controller('ClientInstallationCtrl', (e, t, n, i, l, o, r) => {
    (e.realm = t),
      (e.client = n),
      (e.installation = null),
      (e.download = null),
      (e.configFormat = null),
      (e.filename = null);
    var a = n.protocol;
    a || (a = 'openid-connect'),
      (e.configFormats = i.clientInstallations[a]),
      console.log(`configFormats.length: ${e.configFormats.length}`),
      (e.changeFormat = () => {
        var t = l.url({
          realm: r.realm,
          client: r.client,
          provider: e.configFormat.id,
        });
        'application/zip' === e.configFormat.mediaType
          ? o({
              url: t,
              method: 'GET',
              responseType: 'arraybuffer',
              cache: !1,
            }).then((t) => {
              var n = t.data;
              e.installation = n;
            })
          : o.get(t).then((t) => {
              var n = t.data;
              'application/json' === e.configFormat.mediaType &&
                ((n = angular.fromJson(t.data)), (n = angular.toJson(n, !0))),
                (e.installation = n);
            });
      }),
      (e.download = () => {
        saveAs(
          new Blob([e.installation], { type: e.configFormat.mediaType }),
          e.configFormat.filename,
        );
      });
  }),
  module.controller(
    'ClientDetailCtrl',
    (e, t, n, i, l, o, r, a, c, s, u, d, p, m, f) => {
      (e.serverInfo = o), (e.flows = []), (e.clientFlows = []);
      for (var g = { id: '', alias: '' }, h = 0; h < i.length; h++)
        'client-flow' === i[h].providerId
          ? e.clientFlows.push(i[h])
          : e.flows.push(i[h]);
      function y() {
        e.client.attributes || (e.client.attributes = {}),
          (e.accessType = e.accessTypes[0]),
          e.client.bearerOnly
            ? (e.accessType = e.accessTypes[2])
            : e.client.publicClient && (e.accessType = e.accessTypes[1]),
          e.client.protocol
            ? (e.protocol = e.protocols[e.protocols.indexOf(e.client.protocol)])
            : (e.protocol = e.protocols[0]),
          'RSA_SHA1' === e.client.attributes['saml.signature.algorithm']
            ? (e.signatureAlgorithm = e.signatureAlgorithms[0])
            : 'RSA_SHA256' === e.client.attributes['saml.signature.algorithm']
              ? (e.signatureAlgorithm = e.signatureAlgorithms[1])
              : 'RSA_SHA256_MGF1' ===
                  e.client.attributes['saml.signature.algorithm']
                ? (e.signatureAlgorithm = e.signatureAlgorithms[2])
                : 'RSA_SHA512' ===
                    e.client.attributes['saml.signature.algorithm']
                  ? (e.signatureAlgorithm = e.signatureAlgorithms[3])
                  : 'RSA_SHA512_MGF1' ===
                      e.client.attributes['saml.signature.algorithm']
                    ? (e.signatureAlgorithm = e.signatureAlgorithms[4])
                    : 'DSA_SHA1' ===
                        e.client.attributes['saml.signature.algorithm'] &&
                      (e.signatureAlgorithm = e.signatureAlgorithms[5]),
          'username' === e.client.attributes.saml_name_id_format
            ? (e.nameIdFormat = e.nameIdFormats[0])
            : 'email' === e.client.attributes.saml_name_id_format
              ? (e.nameIdFormat = e.nameIdFormats[1])
              : 'transient' === e.client.attributes.saml_name_id_format
                ? (e.nameIdFormat = e.nameIdFormats[2])
                : 'persistent' === e.client.attributes.saml_name_id_format &&
                  (e.nameIdFormat = e.nameIdFormats[3]),
          e.client.attributes['saml.artifact.binding'] &&
            ('true' === e.client.attributes['saml.artifact.binding']
              ? (e.samlArtifactBinding = !0)
              : (e.samlArtifactBinding = !1)),
          e.client.attributes['saml.server.signature'] &&
            ('true' === e.client.attributes['saml.server.signature']
              ? (e.samlServerSignature = !0)
              : (e.samlServerSignature = !1)),
          e.client.attributes['saml.server.signature.keyinfo.ext'] &&
            ('true' === e.client.attributes['saml.server.signature.keyinfo.ext']
              ? (e.samlServerSignatureEnableKeyInfoExtension = !0)
              : (e.samlServerSignatureEnableKeyInfoExtension = !1)),
          'NONE' ===
          e.client.attributes[
            'saml.server.signature.keyinfo.xmlSigKeyInfoKeyNameTransformer'
          ]
            ? (e.samlXmlKeyNameTranformer = e.xmlKeyNameTranformers[0])
            : 'KEY_ID' ===
                e.client.attributes[
                  'saml.server.signature.keyinfo.xmlSigKeyInfoKeyNameTransformer'
                ]
              ? (e.samlXmlKeyNameTranformer = e.xmlKeyNameTranformers[1])
              : 'CERT_SUBJECT' ===
                  e.client.attributes[
                    'saml.server.signature.keyinfo.xmlSigKeyInfoKeyNameTransformer'
                  ] &&
                (e.samlXmlKeyNameTranformer = e.xmlKeyNameTranformers[2]),
          e.client.attributes['saml.assertion.signature'] &&
            ('true' === e.client.attributes['saml.assertion.signature']
              ? (e.samlAssertionSignature = !0)
              : (e.samlAssertionSignature = !1)),
          e.client.attributes['saml.client.signature'] &&
            ('true' === e.client.attributes['saml.client.signature']
              ? (e.samlClientSignature = !0)
              : (e.samlClientSignature = !1)),
          e.client.attributes['saml.encrypt'] &&
            ('true' === e.client.attributes['saml.encrypt']
              ? (e.samlEncrypt = !0)
              : (e.samlEncrypt = !1)),
          e.client.attributes['saml.authnstatement'] &&
            ('true' === e.client.attributes['saml.authnstatement']
              ? (e.samlAuthnStatement = !0)
              : (e.samlAuthnStatement = !1)),
          e.client.attributes['saml.onetimeuse.condition'] &&
            ('true' === e.client.attributes['saml.onetimeuse.condition']
              ? (e.samlOneTimeUseCondition = !0)
              : (e.samlOneTimeUseCondition = !1)),
          e.client.attributes.saml_force_name_id_format &&
            ('true' === e.client.attributes.saml_force_name_id_format
              ? (e.samlForceNameIdFormat = !0)
              : (e.samlForceNameIdFormat = !1)),
          e.client.attributes['saml.multivalued.roles'] &&
            ('true' === e.client.attributes['saml.multivalued.roles']
              ? (e.samlMultiValuedRoles = !0)
              : (e.samlMultiValuedRoles = !1)),
          e.client.attributes['saml.force.post.binding'] &&
            ('true' === e.client.attributes['saml.force.post.binding']
              ? (e.samlForcePostBinding = !0)
              : (e.samlForcePostBinding = !1)),
          (e.accessTokenSignedResponseAlg =
            e.client.attributes['access.token.signed.response.alg']),
          (e.idTokenSignedResponseAlg =
            e.client.attributes['id.token.signed.response.alg']),
          (e.idTokenEncryptedResponseAlg =
            e.client.attributes['id.token.encrypted.response.alg']),
          (e.idTokenEncryptedResponseEnc =
            e.client.attributes['id.token.encrypted.response.enc']);
        var t = e.client.attributes['user.info.response.signature.alg'];
        e.userInfoSignedResponseAlg = null == t ? 'unsigned' : t;
        var n = e.client.attributes['request.object.signature.alg'];
        e.requestObjectSignatureAlg = null == n ? 'any' : n;
        var i = e.client.attributes['request.object.required'];
        e.requestObjectRequired = null == i ? 'not required' : i;
        var l = e.client.attributes['pkce.code.challenge.method'];
        (e.pkceCodeChallengeMethod = null == l ? 'none' : l),
          e.client.attributes['exclude.session.state.from.auth.response'] &&
            ('true' ===
            e.client.attributes['exclude.session.state.from.auth.response']
              ? (e.excludeSessionStateFromAuthResponse = !0)
              : (e.excludeSessionStateFromAuthResponse = !1)),
          e.client.attributes['oauth2.device.authorization.grant.enabled'] &&
            ('true' ===
            e.client.attributes['oauth2.device.authorization.grant.enabled']
              ? (e.oauth2DeviceAuthorizationGrantEnabled = !0)
              : (e.oauth2DeviceAuthorizationGrantEnabled = !1)),
          e.client.attributes['oidc.ciba.grant.enabled'] &&
            ('true' === e.client.attributes['oidc.ciba.grant.enabled']
              ? (e.oidcCibaGrantEnabled = !0)
              : (e.oidcCibaGrantEnabled = !1)),
          e.client.attributes['use.refresh.tokens'] &&
            ('true' === e.client.attributes['use.refresh.tokens']
              ? (e.useRefreshTokens = !0)
              : (e.useRefreshTokens = !1)),
          e.client.attributes['tls.client.certificate.bound.access.tokens'] &&
            ('true' ===
            e.client.attributes['tls.client.certificate.bound.access.tokens']
              ? (e.tlsClientCertificateBoundAccessTokens = !0)
              : (e.tlsClientCertificateBoundAccessTokens = !1));
        var o = e.client.attributes['client_credentials.use_refresh_token'];
        (e.useRefreshTokenForClientCredentialsGrant = 'true' === o),
          e.client.attributes['display.on.consent.screen'] &&
            ('true' === e.client.attributes['display.on.consent.screen']
              ? (e.displayOnConsentScreen = !0)
              : (e.displayOnConsentScreen = !1)),
          e.client.attributes['backchannel.logout.session.required'] &&
            ('true' ===
            e.client.attributes['backchannel.logout.session.required']
              ? (e.backchannelLogoutSessionRequired = !0)
              : (e.backchannelLogoutSessionRequired = !1)),
          e.client.attributes['backchannel.logout.revoke.offline.tokens'] &&
            ('true' ===
            e.client.attributes['backchannel.logout.revoke.offline.tokens']
              ? (e.backchannelLogoutRevokeOfflineSessions = !0)
              : (e.backchannelLogoutRevokeOfflineSessions = !1)),
          e.client.attributes['request.uris'] &&
          e.client.attributes['request.uris'].length > 0
            ? (e.client.requestUris =
                e.client.attributes['request.uris'].split('##'))
            : (e.client.requestUris = []);
      }
      function v() {
        return (
          !angular.equals(e.client, e.clientEdit) ||
          !!(e.newRedirectUri && e.newRedirectUri.length > 0) ||
            !!(e.newWebOrigin && e.newWebOrigin.length > 0) ||
          !!(e.newRequestUri && e.newRequestUri.length > 0)
        );
      }
      e.flows.push(g),
        e.clientFlows.push(g),
        (e.accessTypes = ['confidential', 'public', 'bearer-only']),
        (e.protocols = o.listProviderIds('login-protocol')),
        (e.signatureAlgorithms = [
          'RSA_SHA1',
          'RSA_SHA256',
          'RSA_SHA256_MGF1',
          'RSA_SHA512',
          'RSA_SHA512_MGF1',
          'DSA_SHA1',
        ]),
        (e.nameIdFormats = ['username', 'email', 'transient', 'persistent']),
        (e.xmlKeyNameTranformers = ['NONE', 'KEY_ID', 'CERT_SUBJECT']),
        (e.canonicalization = [
          {
            name: 'EXCLUSIVE',
            value: 'http://www.w3.org/2001/10/xml-exc-c14n#',
          },
          {
            name: 'EXCLUSIVE_WITH_COMMENTS',
            value: 'http://www.w3.org/2001/10/xml-exc-c14n#WithComments',
          },
          {
            name: 'INCLUSIVE',
            value: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
          },
          {
            name: 'INCLUSIVE_WITH_COMMENTS',
            value:
              'http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments',
          },
        ]),
        (e.requestObjectRequiredOptions = [
          'not required',
          'request or request_uri',
          'request only',
          'request_uri only',
        ]),
        (e.changePkceCodeChallengeMethodOptions = ['S256', 'plain', '']),
        (e.realm = t),
        (e.samlAuthnStatement = !1),
        (e.samlOneTimeUseCondition = !1),
        (e.samlMultiValuedRoles = !1),
        (e.samlArtifactBinding = !1),
        (e.samlServerSignature = !1),
        (e.samlServerSignatureEnableKeyInfoExtension = !1),
        (e.samlAssertionSignature = !1),
        (e.samlClientSignature = !1),
        (e.samlEncrypt = !1),
        (e.samlForcePostBinding = !1),
        (e.samlForceNameIdFormat = !1),
        (e.samlXmlKeyNameTranformer = e.xmlKeyNameTranformers[1]),
        (e.disableAuthorizationTab = !n.authorizationServicesEnabled),
        (e.disableServiceAccountRolesTab = !n.serviceAccountsEnabled),
        (e.disableCredentialsTab = n.publicClient),
        (e.oauth2DeviceAuthorizationGrantEnabled = !1),
        (e.oidcCibaGrantEnabled = !1),
        (e.tlsClientCertificateBoundAccessTokens = !1),
        (e.useRefreshTokens = !0),
        (e.accessTokenLifespan = f.asUnit(
          n.attributes['access.token.lifespan'],
        )),
        (e.samlAssertionLifespan = f.asUnit(
          n.attributes['saml.assertion.lifespan'],
        )),
        (e.clientSessionIdleTimeout = f.asUnit(
          n.attributes['client.session.idle.timeout'],
        )),
        (e.clientSessionMaxLifespan = f.asUnit(
          n.attributes['client.session.max.lifespan'],
        )),
        (e.clientOfflineSessionIdleTimeout = f.asUnit(
          n.attributes['client.offline.session.idle.timeout'],
        )),
        (e.clientOfflineSessionMaxLifespan = f.asUnit(
          n.attributes['client.offline.session.max.lifespan'],
        )),
        (e.oauth2DeviceCodeLifespan = f.asUnit(
          n.attributes['oauth2.device.code.lifespan'],
        )),
        (e.oauth2DevicePollingInterval = parseInt(
          n.attributes['oauth2.device.polling.interval'],
          10,
        )),
        n.origin
          ? e.access.viewRealm
            ? c.get({ realm: t.realm, componentId: n.origin }, (t) => {
                e.originName = t.name;
              })
            : s.simpleName.get(
                { realm: t.realm, componentId: n.origin },
                (t) => {
                  e.originName = t.name;
                },
              )
          : console.log('origin is null'),
        e.create || ((e.client = n), y(), (e.clientEdit = angular.copy(n))),
        (e.samlIdpInitiatedUrl = (e) =>
          encodeURI(
            `${u.absUrl().replace(/\/admin.*/, '/realms/') + t.realm}/protocol/saml/clients/`,
          ) + encodeURIComponent(e)),
        (e.importFile = (i) => {
          console.debug(i),
            a.save({ realm: t.realm }, i, (t) => {
              (e.client = t),
                y(),
                (e.importing = !0),
                (e.clientEdit = angular.copy(n));
            });
        }),
        (e.viewImportDetails = () => {
          d.open({
            templateUrl: `${resourceUrl}/partials/modal/view-object.html`,
            controller: 'ObjectModalCtrl',
            resolve: { object: () => e.client },
          });
        }),
        (e.switchChange = () => {
          e.changed = !0;
        }),
        (e.changeAccessType = () => {
          'confidential' === e.accessType
            ? ((e.clientEdit.bearerOnly = !1), (e.clientEdit.publicClient = !1))
            : 'public' === e.accessType
              ? ((e.clientEdit.bearerOnly = !1),
                (e.clientEdit.publicClient = !0))
              : 'bearer-only' === e.accessType &&
                ((e.clientEdit.bearerOnly = !0),
                (e.clientEdit.publicClient = !1),
                (e.clientEdit.alwaysDisplayInConsole = !1));
        }),
        (e.changeProtocol = () => {
          'openid-connect' === e.protocol
            ? (e.clientEdit.protocol = 'openid-connect')
            : 'saml' === e.protocol && (e.clientEdit.protocol = 'saml');
        }),
        (e.changeAlgorithm = () => {
          e.clientEdit.attributes['saml.signature.algorithm'] =
            e.signatureAlgorithm;
        }),
        (e.changeNameIdFormat = () => {
          e.clientEdit.attributes.saml_name_id_format = e.nameIdFormat;
        }),
        (e.changeSamlSigKeyNameTranformer = () => {
          e.clientEdit.attributes[
            'saml.server.signature.keyinfo.xmlSigKeyInfoKeyNameTransformer'
          ] = e.samlXmlKeyNameTranformer;
        }),
        (e.changeAccessTokenSignedResponseAlg = () => {
          e.clientEdit.attributes['access.token.signed.response.alg'] =
            e.accessTokenSignedResponseAlg;
        }),
        (e.changeIdTokenSignedResponseAlg = () => {
          e.clientEdit.attributes['id.token.signed.response.alg'] =
            e.idTokenSignedResponseAlg;
        }),
        (e.changeIdTokenEncryptedResponseAlg = () => {
          e.clientEdit.attributes['id.token.encrypted.response.alg'] =
            e.idTokenEncryptedResponseAlg;
        }),
        (e.changeIdTokenEncryptedResponseEnc = () => {
          e.clientEdit.attributes['id.token.encrypted.response.enc'] =
            e.idTokenEncryptedResponseEnc;
        }),
        (e.changeUserInfoSignedResponseAlg = () => {
          'unsigned' === e.userInfoSignedResponseAlg
            ? (e.clientEdit.attributes['user.info.response.signature.alg'] =
                null)
            : (e.clientEdit.attributes['user.info.response.signature.alg'] =
                e.userInfoSignedResponseAlg);
        }),
        (e.changeRequestObjectSignatureAlg = () => {
          'any' === e.requestObjectSignatureAlg
            ? (e.clientEdit.attributes['request.object.signature.alg'] = null)
            : (e.clientEdit.attributes['request.object.signature.alg'] =
                e.requestObjectSignatureAlg);
        }),
        (e.changeRequestObjectRequired = () => {
          'not required' === e.requestObjectRequired
            ? (e.clientEdit.attributes['request.object.required'] = null)
            : (e.clientEdit.attributes['request.object.required'] =
                e.requestObjectRequired);
        }),
        (e.changePkceCodeChallengeMethod = () => {
          e.clientEdit.attributes['pkce.code.challenge.method'] =
            e.pkceCodeChallengeMethod;
        }),
        e.$watch(
          () => u.path(),
          () => {
            e.path = u.path().substring(1).split('/');
          },
        ),
        (e.updateTimeouts = () => {
          e.accessTokenLifespan.time
            ? -1 === e.accessTokenLifespan.time
              ? (e.clientEdit.attributes['access.token.lifespan'] = -1)
              : (e.clientEdit.attributes['access.token.lifespan'] =
                  e.accessTokenLifespan.toSeconds())
            : (e.clientEdit.attributes['access.token.lifespan'] = null);
        }),
        (e.updateAssertionLifespan = () => {
          e.samlAssertionLifespan.time
            ? (e.clientEdit.attributes['saml.assertion.lifespan'] =
                e.samlAssertionLifespan.toSeconds())
            : (e.clientEdit.attributes['saml.assertion.lifespan'] = null);
        }),
        (e.updateClientSessionIdleTimeout = () => {
          e.clientSessionIdleTimeout.time
            ? (e.clientEdit.attributes['client.session.idle.timeout'] =
                e.clientSessionIdleTimeout.toSeconds())
            : (e.clientEdit.attributes['client.session.idle.timeout'] = null);
        }),
        (e.updateClientSessionMaxLifespan = () => {
          e.clientSessionMaxLifespan.time
            ? (e.clientEdit.attributes['client.session.max.lifespan'] =
                e.clientSessionMaxLifespan.toSeconds())
            : (e.clientEdit.attributes['client.session.max.lifespan'] = null);
        }),
        (e.updateClientOfflineSessionIdleTimeout = () => {
          e.clientOfflineSessionIdleTimeout.time
            ? (e.clientEdit.attributes['client.offline.session.idle.timeout'] =
                e.clientOfflineSessionIdleTimeout.toSeconds())
            : (e.clientEdit.attributes['client.offline.session.idle.timeout'] =
                null);
        }),
        (e.updateClientOfflineSessionMaxLifespan = () => {
          e.clientOfflineSessionMaxLifespan.time
            ? (e.clientEdit.attributes['client.offline.session.max.lifespan'] =
                e.clientOfflineSessionMaxLifespan.toSeconds())
            : (e.clientEdit.attributes['client.offline.session.max.lifespan'] =
                null);
        }),
        (e.updateOauth2DeviceCodeLifespan = () => {
          e.oauth2DeviceCodeLifespan.time
            ? (e.clientEdit.attributes['oauth2.device.code.lifespan'] =
                e.oauth2DeviceCodeLifespan.toSeconds())
            : (e.clientEdit.attributes['oauth2.device.code.lifespan'] = null);
        }),
        (e.updateOauth2DevicePollingInterval = () => {
          e.oauth2DevicePollingInterval
            ? (e.clientEdit.attributes['oauth2.device.polling.interval'] =
                e.oauth2DevicePollingInterval)
            : (e.clientEdit.attributes['oauth2.device.polling.interval'] =
                null);
        }),
        e.$watch(
          'clientEdit',
          () => {
            (e.changed = v()),
              e.clientEdit.authorizationServicesEnabled
                ? ('public' === e.accessType && (e.accessType = 'confidential'),
                  (e.clientEdit.publicClient = !1),
                  (e.clientEdit.serviceAccountsEnabled = !0))
                : e.clientEdit.bearerOnly &&
                  (e.clientEdit.serviceAccountsEnabled = !1),
              e.client.authorizationServicesEnabled &&
                !e.clientEdit.authorizationServicesEnabled &&
                p.confirm(
                  'Disable Authorization Settings',
                  'Are you sure you want to disable authorization ? Once you save your changes, all authorization settings associated with this client will be removed. This operation can not be reverted.',
                  () => {},
                  () => {
                    e.clientEdit.authorizationServicesEnabled = !0;
                  },
                );
          },
          !0,
        ),
        e.$watch(
          'newRedirectUri',
          () => {
            e.changed = v();
          },
          !0,
        ),
        e.$watch(
          'newWebOrigin',
          () => {
            e.changed = v();
          },
          !0,
        ),
        e.$watch(
          'newRequestUri',
          () => {
            e.changed = v();
          },
          !0,
        ),
        (e.deleteWebOrigin = (t) => {
          e.clientEdit.webOrigins.splice(t, 1);
        }),
        (e.addWebOrigin = () => {
          e.clientEdit.webOrigins.push(e.newWebOrigin), (e.newWebOrigin = '');
        }),
        (e.deleteRequestUri = (t) => {
          e.clientEdit.requestUris.splice(t, 1);
        }),
        (e.addRequestUri = () => {
          e.clientEdit.requestUris.push(e.newRequestUri),
            (e.newRequestUri = '');
        }),
        (e.deleteRedirectUri = (t) => {
          e.clientEdit.redirectUris.splice(t, 1);
        }),
        (e.addRedirectUri = () => {
          e.clientEdit.redirectUris.push(e.newRedirectUri),
            (e.newRedirectUri = '');
        }),
        (e.save = () => {
          e.newRedirectUri && e.newRedirectUri.length > 0 && e.addRedirectUri(),
            e.newWebOrigin && e.newWebOrigin.length > 0 && e.addWebOrigin(),
            e.newRequestUri && e.newRequestUri.length > 0 && e.addRequestUri(),
            e.clientEdit.requestUris && e.clientEdit.requestUris.length > 0
              ? (e.clientEdit.attributes['request.uris'] =
                  e.clientEdit.requestUris.join('##'))
              : (e.clientEdit.attributes['request.uris'] = null),
            delete e.clientEdit.requestUris,
            1 === e.samlArtifactBinding
              ? (e.clientEdit.attributes['saml.artifact.binding'] = 'true')
              : (e.clientEdit.attributes['saml.artifact.binding'] = 'false'),
            1 === e.samlServerSignature
              ? (e.clientEdit.attributes['saml.server.signature'] = 'true')
              : (e.clientEdit.attributes['saml.server.signature'] = 'false'),
            1 === e.samlServerSignatureEnableKeyInfoExtension
              ? (e.clientEdit.attributes['saml.server.signature.keyinfo.ext'] =
                  'true')
              : (e.clientEdit.attributes['saml.server.signature.keyinfo.ext'] =
                  'false'),
            1 === e.samlAssertionSignature
              ? (e.clientEdit.attributes['saml.assertion.signature'] = 'true')
              : (e.clientEdit.attributes['saml.assertion.signature'] = 'false'),
            1 === e.samlClientSignature
              ? (e.clientEdit.attributes['saml.client.signature'] = 'true')
              : (e.clientEdit.attributes['saml.client.signature'] = 'false'),
            1 === e.samlEncrypt
              ? (e.clientEdit.attributes['saml.encrypt'] = 'true')
              : (e.clientEdit.attributes['saml.encrypt'] = 'false'),
            1 === e.samlAuthnStatement
              ? (e.clientEdit.attributes['saml.authnstatement'] = 'true')
              : (e.clientEdit.attributes['saml.authnstatement'] = 'false'),
            1 === e.samlOneTimeUseCondition
              ? (e.clientEdit.attributes['saml.onetimeuse.condition'] = 'true')
              : (e.clientEdit.attributes['saml.onetimeuse.condition'] =
                  'false'),
            1 === e.samlForceNameIdFormat
              ? (e.clientEdit.attributes.saml_force_name_id_format = 'true')
              : (e.clientEdit.attributes.saml_force_name_id_format = 'false'),
            1 === e.samlMultiValuedRoles
              ? (e.clientEdit.attributes['saml.multivalued.roles'] = 'true')
              : (e.clientEdit.attributes['saml.multivalued.roles'] = 'false'),
            1 === e.samlForcePostBinding
              ? (e.clientEdit.attributes['saml.force.post.binding'] = 'true')
              : (e.clientEdit.attributes['saml.force.post.binding'] = 'false'),
            1 === e.excludeSessionStateFromAuthResponse
              ? (e.clientEdit.attributes[
                  'exclude.session.state.from.auth.response'
                ] = 'true')
              : (e.clientEdit.attributes[
                  'exclude.session.state.from.auth.response'
                ] = 'false'),
            1 === e.oauth2DeviceAuthorizationGrantEnabled
              ? (e.clientEdit.attributes[
                  'oauth2.device.authorization.grant.enabled'
                ] = 'true')
              : (e.clientEdit.attributes[
                  'oauth2.device.authorization.grant.enabled'
                ] = 'false'),
            1 === e.oidcCibaGrantEnabled
              ? (e.clientEdit.attributes['oidc.ciba.grant.enabled'] = 'true')
              : (e.clientEdit.attributes['oidc.ciba.grant.enabled'] = 'false'),
            1 === e.useRefreshTokens
              ? (e.clientEdit.attributes['use.refresh.tokens'] = 'true')
              : (e.clientEdit.attributes['use.refresh.tokens'] = 'false'),
            1 === e.tlsClientCertificateBoundAccessTokens
              ? (e.clientEdit.attributes[
                  'tls.client.certificate.bound.access.tokens'
                ] = 'true')
              : (e.clientEdit.attributes[
                  'tls.client.certificate.bound.access.tokens'
                ] = 'false'),
            !0 === e.useRefreshTokenForClientCredentialsGrant
              ? (e.clientEdit.attributes[
                  'client_credentials.use_refresh_token'
                ] = 'true')
              : (e.clientEdit.attributes[
                  'client_credentials.use_refresh_token'
                ] = 'false'),
            1 === e.displayOnConsentScreen
              ? (e.clientEdit.attributes['display.on.consent.screen'] = 'true')
              : (e.clientEdit.attributes['display.on.consent.screen'] =
                  'false'),
            1 === e.backchannelLogoutSessionRequired
              ? (e.clientEdit.attributes[
                  'backchannel.logout.session.required'
                ] = 'true')
              : (e.clientEdit.attributes[
                  'backchannel.logout.session.required'
                ] = 'false'),
            1 === e.backchannelLogoutRevokeOfflineSessions
              ? (e.clientEdit.attributes[
                  'backchannel.logout.revoke.offline.tokens'
                ] = 'true')
              : (e.clientEdit.attributes[
                  'backchannel.logout.revoke.offline.tokens'
                ] = 'false'),
            (e.clientEdit.protocol = e.protocol),
            (e.clientEdit.attributes['saml.signature.algorithm'] =
              e.signatureAlgorithm),
            (e.clientEdit.attributes.saml_name_id_format = e.nameIdFormat),
            'saml' === e.clientEdit.protocol ||
            e.clientEdit.bearerOnly ||
            (!e.clientEdit.standardFlowEnabled &&
              !e.clientEdit.implicitFlowEnabled) ||
            (e.clientEdit.redirectUris &&
              0 !== e.clientEdit.redirectUris.length)
              ? r.update({ realm: t.realm, client: n.id }, e.clientEdit, () => {
                  l.reload(),
                    m.success('Your changes have been saved to the client.');
                })
              : m.error('You must specify at least one redirect uri');
        }),
        (e.reset = () => {
          l.reload();
        }),
        (e.cancel = () => {
          u.url(`/realms/${t.realm}/clients`);
        });
    },
  ),
  module.controller('CreateClientCtrl', (e, t, n, i, l, o, r, a, c, _s, u) => {
    (e.protocols = l.listProviderIds('login-protocol')),
      (e.create = !0),
      (e.realm = t),
      (e.client = { enabled: !0, attributes: {} }),
      (e.client.redirectUris = []),
      (e.protocol = e.protocols[0]),
      (e.importFile = (n) => {
        console.debug(n),
          r.save({ realm: t.realm }, n, (t) => {
            (e.client = t),
              t.protocol && (e.protocol = t.protocol),
              (e.importing = !0);
          });
      }),
      (e.viewImportDetails = () => {
        c.open({
          templateUrl: `${resourceUrl}/partials/modal/view-object.html`,
          controller: 'ObjectModalCtrl',
          resolve: { object: () => e.client },
        });
      }),
      (e.switchChange = () => {
        e.changed = !0;
      }),
      (e.changeProtocol = () => {
        'openid-connect' === e.protocol
          ? (e.client.protocol = 'openid-connect')
          : 'saml' === e.protocol && (e.client.protocol = 'saml');
      }),
      e.$watch(
        () => a.path(),
        () => {
          e.path = a.path().substring(1).split('/');
        },
      ),
      e.$watch(
        'client',
        () => {
          e.changed = !angular.equals(e.client, n);
        },
        !0,
      ),
      (e.save = () => {
        (e.client.protocol = e.protocol),
          o.save({ realm: t.realm, client: '' }, e.client, (_n, i) => {
            e.changed = !1;
            var l = i().location,
              o = l.substring(l.lastIndexOf('/') + 1);
            a.url(`/realms/${t.realm}/clients/${o}`),
              u.success('The client has been created.');
          });
      }),
      (e.reset = () => {
        i.reload();
      }),
      (e.cancel = () => {
        a.url(`/realms/${t.realm}/clients`);
      });
  }),
  module.controller(
    'ClientScopeMappingCtrl',
    (e, t, n, i, l, o, r, a, _c, s, u, _d, p, m, f, g) => {
      function h() {
        (e.realmRoles = p.query({ realm: n.realm, client: l.id })),
          (e.realmMappings = s.query({ realm: n.realm, client: l.id })),
          (e.realmComposite = f.query({ realm: n.realm, client: l.id }));
      }
      function y() {
        e.selectedClient
          ? ((e.clientRoles = m.query({
              realm: n.realm,
              client: l.id,
              targetClient: e.selectedClient.id,
            })),
            (e.clientMappings = u.query({
              realm: n.realm,
              client: l.id,
              targetClient: e.selectedClient.id,
            })),
            (e.clientComposite = g.query({
              realm: n.realm,
              client: l.id,
              targetClient: e.selectedClient.id,
            })))
          : ((e.clientRoles = null),
            (e.clientMappings = null),
            (e.clientComposite = null));
      }
      (e.realm = n),
        (e.client = angular.copy(l)),
        (e.selectedRealmRoles = []),
        (e.selectedRealmMappings = []),
        (e.realmMappings = []),
        (e.clients = o),
        (e.clientRoles = []),
        (e.clientComposite = []),
        (e.selectedClientRoles = []),
        (e.selectedClientMappings = []),
        (e.clientMappings = []),
        (e.dummymodel = []),
        (e.hideRoleSelector = () => e.client.fullScopeAllowed),
        (e.changeFlag = () => {
          console.log('changeFlag'),
            a.update({ realm: n.realm, client: l.id }, e.client, () => {
              (e.changed = !1),
                (l = angular.copy(e.client)),
                h(),
                r.success('Scope mappings updated.');
            });
        }),
        (e.selectedClient = null),
        (e.selectClient = (t) => {
          t?.id ? ((e.selectedClient = t), y()) : (e.selectedClient = null);
        }),
        (e.addRealmRole = () => {
          (e.selectedRealmRolesToAdd = JSON.parse(`[${e.selectedRealmRoles}]`)),
            (e.selectedRealmRoles = []),
            t
              .post(
                `${authUrl}/admin/realms/${n.realm}/clients/${l.id}/scope-mappings/realm`,
                e.selectedRealmRolesToAdd,
              )
              .then(() => {
                h(),
                  (e.selectedRealmRolesToAdd = []),
                  r.success('Scope mappings updated.');
              });
        }),
        (e.deleteRealmRole = () => {
          (e.selectedRealmMappingsToRemove = JSON.parse(
            `[${e.selectedRealmMappings}]`,
          )),
            (e.selectedRealmMappings = []),
            t
              .delete(
                `${authUrl}/admin/realms/${n.realm}/clients/${l.id}/scope-mappings/realm`,
                {
                  data: e.selectedRealmMappingsToRemove,
                  headers: { 'content-type': 'application/json' },
                },
              )
              .then(() => {
                h(),
                  (e.selectedRealmMappingsToRemove = []),
                  r.success('Scope mappings updated.');
              });
        }),
        (e.addClientRole = () => {
          (e.selectedClientRolesToAdd = JSON.parse(
            `[${e.selectedClientRoles}]`,
          )),
            (e.selectedClientRoles = []),
            t
              .post(
                `${authUrl}/admin/realms/${n.realm}/clients/${l.id}/scope-mappings/clients/${e.selectedClient.id}`,
                e.selectedClientRolesToAdd,
              )
              .then(() => {
                y(),
                  (e.selectedClientRolesToAdd = []),
                  r.success('Scope mappings updated.');
              });
        }),
        (e.deleteClientRole = () => {
          (e.selectedClientMappingsToRemove = JSON.parse(
            `[${e.selectedClientMappings}]`,
          )),
            (e.selectedClientMappings = []),
            t
              .delete(
                `${authUrl}/admin/realms/${n.realm}/clients/${l.id}/scope-mappings/clients/${e.selectedClient.id}`,
                {
                  data: e.selectedClientMappingsToRemove,
                  headers: { 'content-type': 'application/json' },
                },
              )
              .then(() => {
                y(),
                  (e.selectedClientMappingsToRemove = []),
                  r.success('Scope mappings updated.');
              });
        }),
        clientSelectControl(e, i.current.params.realm, a),
        h();
    },
  ),
  module.controller('ClientRevocationCtrl', (e, t, n, i, l, _o, _r, a) => {
    (e.realm = t), (e.client = n);
    var c = () => {
      0 === e.client.notBefore
        ? (e.notBefore = 'None')
        : (e.notBefore = new Date(1e3 * e.client.notBefore));
    };
    c();
    var s = () => {
      i.get({ realm: t.realm, client: e.client.id }, (t) => {
        (e.client = t), c();
      });
    };
    (e.clear = () => {
      (e.client.notBefore = 0),
        i.update({ realm: t.realm, client: n.id }, e.client, () => {
          (e.notBefore = 'None'),
            a.success('Not Before cleared for client.'),
            s();
        });
    }),
      (e.setNotBeforeNow = () => {
        (e.client.notBefore = new Date().getTime() / 1e3),
          i.update({ realm: t.realm, client: e.client.id }, e.client, () => {
            a.success('Not Before set for client.'), s();
          });
      }),
      (e.pushRevocation = () => {
        l.save({ realm: t.realm, client: e.client.id }, (e) => {
          var t = e.successRequests ? e.successRequests.length : 0,
            n = e.failedRequests ? e.failedRequests.length : 0;
          if (0 === t && 0 === n)
            a.warn(
              'No push sent. No admin URI configured or no registered cluster nodes available',
            );
          else if (n > 0) {
            var i =
              t > 0
                ? `Successfully push notBefore to: ${e.successRequests} . `
                : '';
            a.error(
              `${i}Failed to push notBefore to: ${e.failedRequests}. Verify availability of failed hosts and try again`,
            );
          } else
            a.success(`Successfully push notBefore to: ${e.successRequests}`);
        });
      });
  }),
  module.controller(
    'ClientClusteringCtrl',
    (e, t, n, i, l, o, _r, a, c, s, u) => {
      (e.client = t), (e.realm = o);
      var d = angular.copy(e.client);
      if (
        ((e.changed = !1),
        e.$watch(
          'client',
          () => {
            angular.equals(e.client, d) || (e.changed = !0);
          },
          !0,
        ),
        (e.client.nodeReRegistrationTimeoutUnit = u.autoUnit(
          t.nodeReRegistrationTimeout,
        )),
        (e.client.nodeReRegistrationTimeout = u.toUnit(
          t.nodeReRegistrationTimeout,
          e.client.nodeReRegistrationTimeoutUnit,
        )),
        (e.save = () => {
          var i = angular.copy(e.client);
          delete i.nodeReRegistrationTimeoutUnit,
            (i.nodeReRegistrationTimeout = u.toSeconds(
              e.client.nodeReRegistrationTimeout,
              e.client.nodeReRegistrationTimeoutUnit,
            )),
            n.update({ realm: o.realm, client: t.id }, i, () => {
              a.reload(),
                s.success('Your changes have been saved to the client.');
            });
        }),
        (e.reset = () => {
          a.reload();
        }),
        (e.testNodesAvailable = () => {
          i.get({ realm: o.realm, client: t.id }, (e) => {
            a.reload();
            var t = e.successRequests ? e.successRequests.length : 0,
              n = e.failedRequests ? e.failedRequests.length : 0;
            if (0 === t && 0 === n)
              s.warn(
                'No requests sent. No admin URI configured or no registered cluster nodes available',
              );
            else if (n > 0) {
              var i =
                t > 0
                  ? `Successfully verify availability for ${e.successRequests} . `
                  : '';
              s.error(
                `${i}Failed to verify availability for: ${e.failedRequests}. Fix or unregister failed cluster nodes and try again`,
              );
            } else
              s.success(`Successfully sent requests to: ${e.successRequests}`);
          });
        }),
        t.registeredNodes)
      ) {
        var p = [];
        for (node in t.registeredNodes)
          (reg = {
            host: node,
            lastRegistration: new Date(1e3 * t.registeredNodes[node]),
          }),
            p.push(reg);
        e.nodeRegistrations = p;
      }
      e.removeNode = (e) => {
        c.confirmDelete(e.host, 'node', () => {
          l.remove({ realm: o.realm, client: t.id, node: e.host }, () => {
            s.success(`Node ${e.host} unregistered successfully.`), a.reload();
          });
        });
      };
    },
  ),
  module.controller(
    'ClientClusteringNodeCtrl',
    (e, t, _n, i, l, o, r, a, c) => {
      if (
        ((e.client = t),
        (e.realm = l),
        (e.create = !r.node),
        (e.save = () => {
          i.save({ realm: l.realm, client: t.id, node: e.node.host }, () => {
            a.success(`Node ${e.node.host} registered successfully.`),
              o.url(`/realms/${l.realm}/clients/${t.id}/clustering`);
          });
        }),
        (e.unregisterNode = () => {
          c.confirmDelete(e.node.host, 'node', () => {
            i.remove(
              { realm: l.realm, client: t.id, node: e.node.host },
              () => {
                a.success(`Node ${e.node.host} unregistered successfully.`),
                  o.url(`/realms/${l.realm}/clients/${t.id}/clustering`);
              },
            );
          });
        }),
        e.create)
      )
        (e.node = {}), (e.registered = !1);
      else {
        var s = t.registeredNodes[r.node];
        s
          ? ((e.registered = !0),
            (e.node = { host: r.node, lastRegistration: new Date(1e3 * s) }))
          : ((e.registered = !1), (e.node = { host: r.node }));
      }
    },
  ),
  module.controller(
    'AddBuiltinProtocolMapperCtrl',
    (e, t, n, i, l, o, r, _a, c) => {
      (e.realm = t),
        (e.client = n),
        null == n.protocol && (n.protocol = 'openid-connect');
      for (
        var s = i.protocolMapperTypes[n.protocol], u = {}, d = 0;
        d < s.length;
        d++
      )
        u[s[d].id] = s[d];
      e.mapperTypes = u;
      !(() => {
        var o = l.query(
          { realm: t.realm, client: n.id, protocol: n.protocol },
          () => {
            for (
              var t = i.builtinProtocolMappers[n.protocol], l = 0;
              l < o.length;
              l++
            )
              for (var r = 0; r < t.length; r++)
                if (
                  t[r].name === o[l].name &&
                  t[r].protocolMapper === o[l].protocolMapper
                ) {
                  t.splice(r, 1);
                  break;
                }
            e.mappers = t;
            for (l = 0; l < e.mappers.length; l++) e.mappers[l].isChecked = !1;
          },
        );
      })(),
        (e.add = () => {
          for (var i = [], l = 0; l < e.mappers.length; l++)
            e.mappers[l].isChecked &&
              (delete e.mappers[l].isChecked, i.push(e.mappers[l]));
          o.post(
            `${authUrl}/admin/realms/${t.realm}/clients/${n.id}/protocol-mappers/add-models`,
            i,
          )
            .then(() => {
              c.success('Mappers added'),
                r.url(`/realms/${t.realm}/clients/${n.id}/mappers`);
            })
            .catch(() => {
              c.error('Error adding mappers'),
                r.url(`/realms/${t.realm}/clients/${n.id}/mappers`);
            });
        });
    },
  ),
  module.controller(
    'ClientProtocolMapperListCtrl',
    (e, t, n, i, l, o, r, a, c, s) => {
      (e.realm = t),
        (e.client = n),
        null == n.protocol && (n.protocol = 'openid-connect'),
        (e.changeFlag = () => {
          l.update({ realm: t.realm, client: n.id }, e.client, () => {
            (e.changed = !1),
              (n = angular.copy(e.client)),
              s.success('Client updated.');
          });
        });
      for (
        var u = i.protocolMapperTypes[n.protocol], d = {}, p = 0;
        p < u.length;
        p++
      )
        d[u[p].id] = u[p];
      (e.mapperTypes = d),
        (e.removeMapper = (e) => {
          console.debug(e),
            c.confirmDelete(e.name, 'mapper', () => {
              r.remove({ realm: t.realm, client: n.id, id: e.id }, () => {
                s.success('The mapper has been deleted.'), a.reload();
              });
            });
        }),
        (e.sortMappersByPriority = (t) =>
          e.mapperTypes[t.protocolMapper].priority);
      e.mappers = o.query({
        realm: t.realm,
        client: n.id,
        protocol: n.protocol,
      });
    },
  ),
  module.controller(
    'ClientProtocolMapperCtrl',
    (e, t, n, i, l, o, r, a, c, s) => {
      (e.realm = t),
        (e.clients = l),
        null == i.protocol && (i.protocol = 'openid-connect'),
        (e.model = {
          realm: t,
          client: i,
          create: !1,
          protocol: i.protocol,
          mapper: angular.copy(o),
          changed: !1,
        });
      for (var u = n.protocolMapperTypes[i.protocol], d = 0; d < u.length; d++)
        u[d].id === o.protocolMapper && (e.model.mapperType = u[d]);
      e.$watch(
        () => s.path(),
        () => {
          e.path = s.path().substring(1).split('/');
        },
      ),
        e.$watch(
          'model.mapper',
          () => {
            angular.equals(e.model.mapper, o) || (e.model.changed = !0);
          },
          !0,
        ),
        (e.save = () => {
          r.update(
            { realm: t.realm, client: i.id, id: e.model.mapper.id },
            e.model.mapper,
            () => {
              (e.model.changed = !1),
                (o = angular.copy(e.mapper)),
                s.url(
                  `/realms/${t.realm}/clients/${i.id}/mappers/${e.model.mapper.id}`,
                ),
                a.success('Your changes have been saved.');
            },
          );
        }),
        (e.reset = () => {
          (e.model.mapper = angular.copy(o)), (e.model.changed = !1);
        }),
        (e.cancel = () => {
          window.history.back();
        }),
        (e.remove = () => {
          c.confirmDelete(e.model.mapper.name, 'mapper', () => {
            r.remove(
              { realm: t.realm, client: i.id, id: e.model.mapper.id },
              () => {
                a.success('The mapper has been deleted.'),
                  s.url(`/realms/${t.realm}/clients/${i.id}/mappers`);
              },
            );
          });
        });
    },
  ),
  module.controller(
    'ClientProtocolMapperCreateCtrl',
    (e, t, n, i, l, o, r, _a, c) => {
      (e.realm = t),
        (e.clients = l),
        null == i.protocol && (i.protocol = 'openid-connect');
      var s = i.protocol;
      (e.model = {
        realm: t,
        client: i,
        create: !0,
        protocol: i.protocol,
        mapper: { protocol: i.protocol, config: {} },
        changed: !1,
        mapperTypes: n.protocolMapperTypes[s],
      }),
        console.log('mapper types: ', e.model.mapperTypes),
        e.$watch(
          'model.mapperType',
          () => {
            var t = e.model.mapperType,
              n = {};
            if (t && Array.isArray(t.properties))
              for (var i = 0; i < t.properties.length; i++) {
                var l = t.properties[i];
                l?.name && l.defaultValue && (n[l.name] = l.defaultValue);
              }
            e.model.mapper.config = n;
          },
          !0,
        ),
        (e.model.mapperType = e.model.mapperTypes[0]),
        e.$watch(
          () => c.path(),
          () => {
            e.path = c.path().substring(1).split('/');
          },
        ),
        (e.save = () => {
          (e.model.mapper.protocolMapper = e.model.mapperType.id),
            o.save(
              { realm: t.realm, client: i.id },
              e.model.mapper,
              (_e, n) => {
                var l = n().location,
                  o = l.substring(l.lastIndexOf('/') + 1);
                c.url(`/realms/${t.realm}/clients/${i.id}/mappers/${o}`),
                  r.success('Mapper has been created.');
              },
            );
        }),
        (e.cancel = () => {
          window.history.back();
        });
    },
  ),
  module.controller(
    'ClientClientScopesSetupCtrl',
    (e, t, _n, i, l, _o, r, a, c, s, u, d, _p) => {
      console.log('ClientClientScopesSetupCtrl'),
        (e.realm = t),
        (e.client = i),
        (e.clientDefaultClientScopes = r),
        (e.clientOptionalClientScopes = c),
        (e.availableClientScopes = []),
        (e.selectedDefaultClientScopes = []),
        (e.selectedDefDefaultClientScopes = []),
        (e.selectedOptionalClientScopes = []),
        (e.selectedDefOptionalClientScopes = []);
      for (var m = 0; m < l.length; m++) {
        var f = l[m],
          g = l[m].name,
          h = !0;
        f.protocol !== i.protocol && (h = !1);
        for (var y = 0; y < e.clientDefaultClientScopes.length; y++)
          g === e.clientDefaultClientScopes[y].name && (h = !1);
        for (y = 0; y < e.clientOptionalClientScopes.length; y++)
          g === e.clientOptionalClientScopes[y].name && (h = !1);
        h && e.availableClientScopes.push(f);
      }
      (e.addDefaultClientScope = () => {
        (e.selectedDefaultClientScopesToAdd = JSON.parse(
          `[${e.selectedDefaultClientScopes}]`,
        )),
          (toAdd = e.selectedDefaultClientScopesToAdd.length);
        for (var n = 0; n < e.selectedDefaultClientScopesToAdd.length; n++) {
          var l = e.selectedDefaultClientScopesToAdd[n];
          a.update(
            { realm: t.realm, client: i.id, clientScopeId: l.id },
            () => {
              (toAdd -= 1),
                0 === toAdd &&
                  (u.reload(), d.success('Default scopes updated.'));
            },
          );
        }
        e.selectedDefaultClientScopesToAdd = [];
      }),
        (e.deleteDefaultClientScope = () => {
          (e.selectedDefDefaultClientScopesToRemove = JSON.parse(
            `[${e.selectedDefDefaultClientScopes}]`,
          )),
            (toRemove = e.selectedDefDefaultClientScopesToRemove.length);
          for (
            var n = 0;
            n < e.selectedDefDefaultClientScopesToRemove.length;
            n++
          ) {
            var l = e.selectedDefDefaultClientScopesToRemove[n];
            a.remove(
              { realm: t.realm, client: i.id, clientScopeId: l.id },
              () => {
                (toRemove -= 1),
                  0 === toRemove &&
                    (u.reload(), d.success('Default scopes updated.'));
              },
            );
          }
          e.selectedDefDefaultClientScopesToRemove = [];
        }),
        (e.addOptionalClientScope = () => {
          (e.selectedOptionalClientScopesToAdd = JSON.parse(
            `[${e.selectedOptionalClientScopes}]`,
          )),
            (toAdd = e.selectedOptionalClientScopesToAdd.length);
          for (var n = 0; n < e.selectedOptionalClientScopesToAdd.length; n++) {
            var l = e.selectedOptionalClientScopesToAdd[n];
            s.update(
              { realm: t.realm, client: i.id, clientScopeId: l.id },
              () => {
                (toAdd -= 1),
                  0 === toAdd &&
                    (u.reload(), d.success('Optional scopes updated.'));
              },
            );
          }
        }),
        (e.deleteOptionalClientScope = () => {
          (e.selectedDefOptionalClientScopesToRemove = JSON.parse(
            `[${e.selectedDefOptionalClientScopes}]`,
          )),
            (toRemove = e.selectedDefOptionalClientScopesToRemove.length);
          for (
            var n = 0;
            n < e.selectedDefOptionalClientScopesToRemove.length;
            n++
          ) {
            var l = e.selectedDefOptionalClientScopesToRemove[n];
            s.remove(
              { realm: t.realm, client: i.id, clientScopeId: l.id },
              () => {
                (toRemove -= 1),
                  0 === toRemove &&
                    (u.reload(), d.success('Optional scopes updated.'));
              },
            );
          }
          e.selectedDefOptionalClientScopesToRemove = [];
        });
    },
  ),
  module.controller(
    'ClientClientScopesEvaluateCtrl',
    (
      e,
      _t,
      n,
      i,
      l,
      o,
      r,
      a,
      c,
      s,
      u,
      d,
      _p,
      m,
      f,
      g,
      h,
      y,
      _v,
      b,
      _C,
      _S,
      T,
    ) => {
      console.log('ClientClientScopesEvaluateCtrl');
      for (
        var R = m.protocolMapperTypes[u.protocol], A = {}, E = 0;
        E < R.length;
        E++
      )
        A[R[E].id] = R[E];
      (e.mapperTypes = A),
        (e.realm = s),
        (e.client = u),
        (e.clients = d),
        (e.userId = null),
        (e.availableClientScopes = []),
        (e.assignedClientScopes = []),
        (e.selectedClientScopes = []),
        (e.selectedDefClientScopes = []),
        (e.effectiveClientScopes = []);
      for (E = 0; E < g.length; E++) e.availableClientScopes.push(g[E]);
      function k() {
        (e.protocolMappers = null),
          (e.grantedRealmRoles = null),
          (e.notGrantedRealmRoles = null),
          (e.grantedClientRoles = null),
          (e.notGrantedClientRoles = null),
          (e.targetClient = null),
          (e.oidcAccessToken = null),
          (e.oidcIDToken = null),
          (e.oidcUserInfo = null),
          (e.selectedTab = 0);
      }
      function q() {
        e.scopeParam = 'openid';
        for (var t = 0; t < e.assignedClientScopes.length; t++) {
          var n = e.assignedClientScopes[t].name;
          e.scopeParam = `${e.scopeParam} ${n}`;
        }
        e.effectiveClientScopes = [];
        for (t = 0; t < h.length; t++) {
          var i = h[t];
          e.effectiveClientScopes.push(i);
        }
        for (t = 0; t < e.assignedClientScopes.length; t++) {
          i = e.assignedClientScopes[t];
          e.effectiveClientScopes.push(i);
        }
        k();
      }
      function w(e) {
        return b.get(e).then((e) => {
          if (e.data) {
            var t = angular.fromJson(e.data);
            return angular.toJson(t, !0);
          }
          return null;
        });
      }
      function I(e, t) {
        return e === t ? 'active' : '';
      }
      function D() {
        e.selectedClient
          ? ((e.grantedClientRoles = l.query({
              realm: s.realm,
              client: u.id,
              roleContainer: e.selectedClient.id,
              scopeParam: e.scopeParam,
            })),
            (e.notGrantedClientRoles = o.query({
              realm: s.realm,
              client: u.id,
              roleContainer: e.selectedClient.id,
              scopeParam: e.scopeParam,
            })))
          : ((e.grantedClientRoles = null), (e.notGrantedClientRoles = null));
      }
      q(),
        (e.addAppliedClientScope = () => {
          e.selectedClientScopesToAdd = JSON.parse(
            `[${e.selectedClientScopes}]`,
          );
          for (var t = 0; t < e.selectedClientScopesToAdd.length; t++) {
            var n = e.selectedClientScopesToAdd[t];
            e.assignedClientScopes.push(n);
            var i = f.findIndexById(e.availableClientScopes, n.id);
            i > -1 && e.availableClientScopes.splice(i, 1);
          }
          (e.selectedClientScopes = []),
            (e.selectedClientScopesToAdd = []),
            q();
        }),
        (e.deleteAppliedClientScope = () => {
          e.selectedDefClientScopesToRemove = JSON.parse(
            `[${e.selectedDefClientScopes}]`,
          );
          for (var t = 0; t < e.selectedDefClientScopesToRemove.length; t++) {
            var n = e.selectedDefClientScopesToRemove[t];
            e.availableClientScopes.push(n);
            var i = f.findIndexById(e.assignedClientScopes, n.id);
            i > -1 && e.assignedClientScopes.splice(i, 1);
          }
          (e.selectedDefClientScopes = []),
            (e.selectedDefClientScopesToRemove = []),
            q();
        }),
        (e.usersUiSelect = {
          minimumInputLength: 1,
          delay: 500,
          allowClear: !0,
          query: (e) => {
            var t = { results: [] };
            '' !== e.term.trim()
              ? n.query(
                  {
                    realm: y.current.params.realm,
                    search: e.term.trim(),
                    max: 20,
                  },
                  (n) => {
                    (t.results = n), e.callback(t);
                  },
                )
              : e.callback(t);
          },
          formatResult: (e, _t, _n) => ((e.text = e.username), e.username),
        }),
        (e.selectedUser = null),
        (e.selectUser = (t) => {
          if ((k(), !t?.id))
            return (e.selectedUser = null), void (e.userId = '');
          e.userId = t.id;
        }),
        clientSelectControl(e, y.current.params.realm, T),
        (e.selectedClient = null),
        (e.selectClient = (t) => {
          console.log('selected client: ', t),
            t?.id ? ((e.selectedClient = t), D()) : (e.selectedClient = null);
        }),
        (e.sendEvaluationRequest = () => {
          if (
            ((e.protocolMappers = i.query({
              realm: s.realm,
              client: u.id,
              scopeParam: e.scopeParam,
            })),
            (e.grantedRealmRoles = l.query({
              realm: s.realm,
              client: u.id,
              roleContainer: s.realm,
              scopeParam: e.scopeParam,
            })),
            (e.notGrantedRealmRoles = o.query({
              realm: s.realm,
              client: u.id,
              roleContainer: s.realm,
              scopeParam: e.scopeParam,
            })),
            'openid-connect' === u.protocol &&
              null != e.userId &&
              '' !== e.userId)
          ) {
            var t = {
              realm: s.realm,
              client: u.id,
              userId: e.userId,
              scopeParam: e.scopeParam,
            };
            w(r.url(t)).then((t) => {
              e.oidcAccessToken = t;
            }),
              w(a.url(t)).then((t) => {
                e.oidcIDToken = t;
              }),
              w(c.url(t)).then((t) => {
                e.oidcUserInfo = t;
              });
          }
          e.showTab(1);
        }),
        (e.isResponseAvailable = () => null != e.protocolMappers),
        (e.isAccessTokenAvailable = () => null != e.oidcAccessToken),
        (e.isIDTokenAvailable = () => null != e.oidcIDToken),
        (e.isUserInfoAvailable = () => null != e.oidcUserInfo),
        (e.showTab = (t) => {
          (e.selectedTab = t),
            (e.tabCss = {
              tab1: I(1, t),
              tab2: I(2, t),
              tab3: I(3, t),
              tab4: I(4, t),
              tab5: I(5, t),
            });
        }),
        (e.protocolMappersShown = () => 1 === e.selectedTab),
        (e.rolesShown = () => 2 === e.selectedTab),
        (e.exampleTabInfo = () => {
          switch (e.selectedTab) {
            case 3:
              return { isShown: !0, value: e.oidcAccessToken };
            case 4:
              return { isShown: !0, value: e.oidcIDToken };
            case 5:
              return { isShown: !0, value: e.oidcUserInfo };
            default:
              return { isShown: !1, value: null };
          }
        }),
        (e.sortMappersByPriority = (t) =>
          e.mapperTypes[t.protocolMapper].priority);
    },
  ),
  module.controller('ClientScopeTabCtrl', (e, t, n, i, l) => {
    t.removeClientScope = () => {
      e.confirmDelete(t.clientScope.name, 'client scope', () => {
        t.clientScope.$remove(
          { realm: n.realm.realm, clientScope: t.clientScope.id },
          () => {
            l.url(`/realms/${n.realm.realm}/client-scopes`),
              i.success('The client scope has been deleted.');
          },
        );
      });
    };
  }),
  module.controller('ClientScopeListCtrl', (e, t, n, i, _l, o, r, a, _c) => {
    (e.realm = t),
      (e.clientScopes = n),
      (e.removeClientScope = (e) => {
        r.confirmDelete(e.name, 'client scope', () => {
          i.remove({ realm: t.realm, clientScope: e.id }, () => {
            o.reload(), a.success('The client scope been deleted.');
          });
        });
      });
  }),
  module.controller(
    'ClientScopesRealmDefaultCtrl',
    (e, t, _n, i, l, o, r, a, _c, s, _u, d, _p) => {
      console.log('ClientScopesRealmDefaultCtrl'),
        (e.realm = t),
        (e.realmDefaultClientScopes = l),
        (e.realmOptionalClientScopes = r),
        (e.availableClientScopes = []),
        (e.selectedDefaultClientScopes = []),
        (e.selectedDefDefaultClientScopes = []),
        (e.selectedOptionalClientScopes = []),
        (e.selectedDefOptionalClientScopes = []);
      for (var m = 0; m < i.length; m++) {
        for (
          var f = i[m].name, g = !0, h = 0;
          h < e.realmDefaultClientScopes.length;
          h++
        )
          f === e.realmDefaultClientScopes[h].name && (g = !1);
        for (h = 0; h < e.realmOptionalClientScopes.length; h++)
          f === e.realmOptionalClientScopes[h].name && (g = !1);
        g && e.availableClientScopes.push(i[m]);
      }
      (e.addDefaultClientScope = () => {
        (e.selectedDefaultClientScopesToAdd = JSON.parse(
          `[${e.selectedDefaultClientScopes}]`,
        )),
          (toAdd = e.selectedDefaultClientScopesToAdd.length);
        for (var n = 0; n < e.selectedDefaultClientScopesToAdd.length; n++) {
          var i = e.selectedDefaultClientScopesToAdd[n];
          o.update({ realm: t.realm, clientScopeId: i.id }, () => {
            (toAdd -= 1),
              console.log(`toAdd: ${toAdd}`),
              0 === toAdd &&
                (s.reload(), d.success('Realm default scopes updated.'));
          });
        }
        e.selectedDefaultClientScopesToAdd = [];
      }),
        (e.deleteDefaultClientScope = () => {
          (e.selectedDefDefaultClientScopesToRemove = JSON.parse(
            `[${e.selectedDefDefaultClientScopes}]`,
          )),
            (toRemove = e.selectedDefDefaultClientScopesToRemove.length);
          for (
            var n = 0;
            n < e.selectedDefDefaultClientScopesToRemove.length;
            n++
          ) {
            var i = e.selectedDefDefaultClientScopesToRemove[n];
            o.remove({ realm: t.realm, clientScopeId: i.id }, () => {
              (toRemove -= 1),
                0 === toRemove &&
                  (s.reload(), d.success('Realm default scopes updated.'));
            });
          }
          e.selectedDefDefaultClientScopesToRemove = [];
        }),
        (e.addOptionalClientScope = () => {
          (e.selectedOptionalClientScopesToAdd = JSON.parse(
            `[${e.selectedOptionalClientScopes}]`,
          )),
            (toAdd = e.selectedOptionalClientScopesToAdd.length);
          for (var n = 0; n < e.selectedOptionalClientScopesToAdd.length; n++) {
            var i = e.selectedOptionalClientScopesToAdd[n];
            a.update({ realm: t.realm, clientScopeId: i.id }, () => {
              (toAdd -= 1),
                console.log(`toAdd: ${toAdd}`),
                0 === toAdd &&
                  (s.reload(), d.success('Realm optional scopes updated.'));
            });
          }
          e.selectedOptionalClientScopesToAdd = [];
        }),
        (e.deleteOptionalClientScope = () => {
          (e.selectedDefOptionalClientScopesToRemove = JSON.parse(
            `[${e.selectedDefOptionalClientScopes}]`,
          )),
            (toRemove = e.selectedDefOptionalClientScopesToRemove.length);
          for (
            var n = 0;
            n < e.selectedDefOptionalClientScopesToRemove.length;
            n++
          ) {
            var i = e.selectedDefOptionalClientScopesToRemove[n];
            a.remove({ realm: t.realm, clientScopeId: i.id }, () => {
              (toRemove -= 1),
                0 === toRemove &&
                  (s.reload(), d.success('Realm optional scopes updated.'));
            });
          }
          e.selectedDefOptionalClientScopesToRemove = [];
        });
    },
  ),
  module.controller(
    'ClientScopeDetailCtrl',
    (e, t, n, i, l, o, r, _a, _c, s) => {
      (e.protocols = l.listProviderIds('login-protocol')),
        (e.realm = t),
        (e.create = !n.name),
        e.create ? (e.clientScope = {}) : (e.clientScope = angular.copy(n)),
        e.clientScope.attributes || (e.clientScope.attributes = {}),
        e.clientScope.protocol
          ? (e.protocol =
              e.protocols[e.protocols.indexOf(e.clientScope.protocol)])
          : (e.protocol = e.protocols[0]),
        e.clientScope.attributes['display.on.consent.screen']
          ? 'true' === e.clientScope.attributes['display.on.consent.screen']
            ? (e.displayOnConsentScreen = !0)
            : (e.displayOnConsentScreen = !1)
          : (e.displayOnConsentScreen = !0),
        e.clientScope.attributes['include.in.token.scope']
          ? 'true' === e.clientScope.attributes['include.in.token.scope']
            ? (e.includeInTokenScope = !0)
            : (e.includeInTokenScope = !1)
          : (e.includeInTokenScope = !0),
        (e.switchChange = () => {
          e.changed = !0;
        }),
        (e.changeProtocol = () => {
          'openid-connect' === e.protocol
            ? (e.clientScope.protocol = 'openid-connect')
            : 'saml' === e.protocol && (e.clientScope.protocol = 'saml');
        }),
        e.$watch(
          () => r.path(),
          () => {
            e.path = r.path().substring(1).split('/');
          },
        ),
        e.$watch(
          'clientScope',
          () => {
            e.changed = !angular.equals(e.clientScope, n);
          },
          !0,
        ),
        (e.save = () => {
          (e.clientScope.protocol = e.protocol),
            1 === e.displayOnConsentScreen
              ? (e.clientScope.attributes['display.on.consent.screen'] = 'true')
              : (e.clientScope.attributes['display.on.consent.screen'] =
                  'false'),
            1 === e.includeInTokenScope
              ? (e.clientScope.attributes['include.in.token.scope'] = 'true')
              : (e.clientScope.attributes['include.in.token.scope'] = 'false'),
            e.create
              ? o.save(
                  { realm: t.realm, clientScope: '' },
                  e.clientScope,
                  (_n, i) => {
                    e.changed = !1;
                    var l = i().location,
                      o = l.substring(l.lastIndexOf('/') + 1);
                    r.url(`/realms/${t.realm}/client-scopes/${o}`),
                      s.success('The client scope has been created.');
                  },
                )
              : o.update(
                  { realm: t.realm, clientScope: n.id },
                  e.clientScope,
                  () => {
                    (e.changed = !1),
                      (n = angular.copy(e.clientScope)),
                      r.url(`/realms/${t.realm}/client-scopes/${n.id}`),
                      s.success(
                        'Your changes have been saved to the client scope.',
                      );
                  },
                );
        }),
        (e.reset = () => {
          i.reload();
        }),
        (e.cancel = () => {
          r.url(`/realms/${t.realm}/client-scopes`);
        });
    },
  ),
  module.controller(
    'ClientScopeProtocolMapperListCtrl',
    (e, t, n, i, l, o, r, a, c) => {
      (e.realm = t),
        (e.clientScope = n),
        null == n.protocol && (n.protocol = 'openid-connect');
      for (
        var s = i.protocolMapperTypes[n.protocol], u = {}, d = 0;
        d < s.length;
        d++
      )
        u[s[d].id] = s[d];
      (e.mapperTypes = u),
        (e.removeMapper = (e) => {
          console.debug(e),
            a.confirmDelete(e.name, 'mapper', () => {
              o.remove({ realm: t.realm, clientScope: n.id, id: e.id }, () => {
                c.success('The mapper has been deleted.'), r.reload();
              });
            });
        }),
        (e.sortMappersByPriority = (t) =>
          e.mapperTypes[t.protocolMapper].priority);
      e.mappers = l.query({
        realm: t.realm,
        clientScope: n.id,
        protocol: n.protocol,
      });
    },
  ),
  module.controller(
    'ClientScopeProtocolMapperCtrl',
    (e, t, n, i, l, o, r, a, c, s, u) => {
      (e.realm = t),
        (e.clients = o),
        null == i.protocol && (i.protocol = 'openid-connect'),
        (e.model = {
          realm: t,
          clientScope: i,
          create: !1,
          protocol: i.protocol,
          mapper: angular.copy(l),
          changed: !1,
        });
      for (var d = n.protocolMapperTypes[i.protocol], p = 0; p < d.length; p++)
        d[p].id === l.protocolMapper && (e.model.mapperType = d[p]);
      e.$watch(
        () => s.path(),
        () => {
          e.path = s.path().substring(1).split('/');
        },
      ),
        e.$watch(
          'model.mapper',
          () => {
            angular.equals(e.model.mapper, l) || (e.model.changed = !0);
          },
          !0,
        ),
        (e.save = () => {
          r.update(
            { realm: t.realm, clientScope: i.id, id: l.id },
            e.model.mapper,
            () => {
              u.reload(), a.success('Your changes have been saved.');
            },
          );
        }),
        (e.reset = () => {
          (e.model.mapper = angular.copy(l)), (e.model.changed = !1);
        }),
        (e.cancel = () => {
          window.history.back();
        }),
        (e.remove = () => {
          c.confirmDelete(e.model.mapper.name, 'mapper', () => {
            r.remove(
              { realm: t.realm, clientScope: i.id, id: e.model.mapper.id },
              () => {
                a.success('The mapper has been deleted.'),
                  s.url(`/realms/${t.realm}/client-scopes/${i.id}/mappers`);
              },
            );
          });
        });
    },
  ),
  module.controller(
    'ClientScopeProtocolMapperCreateCtrl',
    (e, t, n, i, l, o, r, _a, c) => {
      (e.realm = t),
        (e.clients = l),
        null == i.protocol && (i.protocol = 'openid-connect');
      var s = i.protocol;
      (e.model = {
        realm: t,
        clientScope: i,
        create: !0,
        protocol: i.protocol,
        mapper: { protocol: i.protocol, config: {} },
        changed: !1,
        mapperTypes: n.protocolMapperTypes[s],
      }),
        e.$watch(
          'model.mapperType',
          () => {
            var t = e.model.mapperType,
              n = {};
            if (t && Array.isArray(t.properties))
              for (var i = 0; i < t.properties.length; i++) {
                var l = t.properties[i];
                l?.name && l.defaultValue && (n[l.name] = l.defaultValue);
              }
            e.model.mapper.config = n;
          },
          !0,
        ),
        (e.model.mapperType = e.model.mapperTypes[0]),
        e.$watch(
          () => c.path(),
          () => {
            e.path = c.path().substring(1).split('/');
          },
        ),
        (e.save = () => {
          (e.model.mapper.protocolMapper = e.model.mapperType.id),
            o.save(
              { realm: t.realm, clientScope: i.id },
              e.model.mapper,
              (_e, n) => {
                var l = n().location,
                  o = l.substring(l.lastIndexOf('/') + 1);
                c.url(`/realms/${t.realm}/client-scopes/${i.id}/mappers/${o}`),
                  r.success('Mapper has been created.');
              },
            );
        }),
        (e.cancel = () => {
          window.history.back();
        });
    },
  ),
  module.controller(
    'ClientScopeAddBuiltinProtocolMapperCtrl',
    (e, t, n, i, l, o, r, _a, c) => {
      (e.realm = t),
        (e.clientScope = n),
        null == n.protocol && (n.protocol = 'openid-connect');
      for (
        var s = i.protocolMapperTypes[n.protocol], u = {}, d = 0;
        d < s.length;
        d++
      )
        u[s[d].id] = s[d];
      e.mapperTypes = u;
      !(() => {
        var o = l.query(
          { realm: t.realm, clientScope: n.id, protocol: n.protocol },
          () => {
            for (
              var t = i.builtinProtocolMappers[n.protocol], l = 0;
              l < o.length;
              l++
            )
              for (var r = 0; r < t.length; r++)
                if (
                  t[r].name === o[l].name &&
                  t[r].protocolMapper === o[l].protocolMapper
                ) {
                  t.splice(r, 1);
                  break;
                }
            e.mappers = t;
            for (l = 0; l < e.mappers.length; l++) e.mappers[l].isChecked = !1;
          },
        );
      })(),
        (e.add = () => {
          for (var i = [], l = 0; l < e.mappers.length; l++)
            e.mappers[l].isChecked &&
              (delete e.mappers[l].isChecked, i.push(e.mappers[l]));
          o.post(
            `${authUrl}/admin/realms/${t.realm}/client-scopes/${n.id}/protocol-mappers/add-models`,
            i,
          )
            .then(() => {
              c.success('Mappers added'),
                r.url(`/realms/${t.realm}/client-scopes/${n.id}/mappers`);
            })
            .catch(() => {
              c.error('Error adding mappers'),
                r.url(`/realms/${t.realm}/client-scopes/${n.id}/mappers`);
            });
        });
    },
  ),
  module.controller(
    'ClientScopeScopeMappingCtrl',
    (e, t, n, i, l, o, _r, a, c, s, _u, d, p, m, f) => {
      function g() {
        (e.realmRoles = d.query({ realm: i.realm, clientScope: l.id })),
          (e.realmMappings = c.query({ realm: i.realm, clientScope: l.id })),
          (e.realmComposite = m.query({ realm: i.realm, clientScope: l.id }));
      }
      function h() {
        e.selectedClient
          ? ((e.clientRoles = p.query({
              realm: i.realm,
              clientScope: l.id,
              targetClient: e.selectedClient.id,
            })),
            (e.clientMappings = s.query({
              realm: i.realm,
              clientScope: l.id,
              targetClient: e.selectedClient.id,
            })),
            (e.clientComposite = f.query({
              realm: i.realm,
              clientScope: l.id,
              targetClient: e.selectedClient.id,
            })))
          : ((e.clientRoles = null),
            (e.clientMappings = null),
            (e.clientComposite = null));
      }
      (e.realm = i),
        (e.clientScope = angular.copy(l)),
        (e.selectedRealmRoles = []),
        (e.selectedRealmMappings = []),
        (e.realmMappings = []),
        (e.clientRoles = []),
        (e.clientComposite = []),
        (e.selectedClientRoles = []),
        (e.selectedClientMappings = []),
        (e.clientMappings = []),
        (e.dummymodel = []),
        (e.selectedClient = null),
        (e.changeClient = (t) => {
          t?.id ? ((e.selectedClient = t), h()) : (e.selectedClient = null);
        }),
        (e.addRealmRole = () => {
          (e.selectedRealmRolesToAdd = JSON.parse(`[${e.selectedRealmRoles}]`)),
            (e.selectedRealmRoles = []),
            t
              .post(
                `${authUrl}/admin/realms/${i.realm}/client-scopes/${l.id}/scope-mappings/realm`,
                e.selectedRealmRolesToAdd,
              )
              .then(() => {
                g(),
                  (e.selectedRealmRolesToAdd = []),
                  o.success('Scope mappings updated.');
              });
        }),
        (e.deleteRealmRole = () => {
          (e.selectedRealmMappingsToRemove = JSON.parse(
            `[${e.selectedRealmMappings}]`,
          )),
            (e.selectedRealmMappings = []),
            t
              .delete(
                `${authUrl}/admin/realms/${i.realm}/client-scopes/${l.id}/scope-mappings/realm`,
                {
                  data: e.selectedRealmMappingsToRemove,
                  headers: { 'content-type': 'application/json' },
                },
              )
              .then(() => {
                g(),
                  (e.selectedRealmMappingsToRemove = []),
                  o.success('Scope mappings updated.');
              });
        }),
        (e.addClientRole = () => {
          (e.selectedClientRolesToAdd = JSON.parse(
            `[${e.selectedClientRoles}]`,
          )),
            (e.selectedClientRoles = []),
            t
              .post(
                `${authUrl}/admin/realms/${i.realm}/client-scopes/${l.id}/scope-mappings/clients/${e.selectedClient.id}`,
                e.selectedClientRolesToAdd,
              )
              .then(() => {
                h(),
                  (e.selectedClientRolesToAdd = []),
                  o.success('Scope mappings updated.');
              });
        }),
        (e.deleteClientRole = () => {
          (e.selectedClientMappingsToRemove = JSON.parse(
            `[${e.selectedClientMappings}]`,
          )),
            (e.selectedClientMappings = []),
            t
              .delete(
                `${authUrl}/admin/realms/${i.realm}/client-scopes/${l.id}/scope-mappings/clients/${e.selectedClient.id}`,
                {
                  data: e.selectedClientMappingsToRemove,
                  headers: { 'content-type': 'application/json' },
                },
              )
              .then(() => {
                h(),
                  (e.selectedClientMappingsToRemove = []),
                  o.success('Scope mappings updated.');
              });
        }),
        clientSelectControl(e, n.current.params.realm, a),
        g();
    },
  ),
  module.controller('ClientStoresCtrl', (e, t, n, i, l, o, r, a) => {
    console.log('ClientStoresCtrl ++++****'),
      (e.realm = i),
      (e.providers =
        l.componentTypes['org.keycloak.storage.client.ClientStorageProvider']),
      (e.clientStorageProviders =
        l.componentTypes['org.keycloak.storage.client.ClientStorageProvider']),
      (e.instancesLoaded = !1),
      e.providers || (e.providers = []),
      (e.addProvider = (e) => {
        console.log(`Add provider: ${e.id}`),
          t.url(`/create/client-storage/${i.realm}/providers/${e.id}`);
      }),
      (e.getInstanceLink = (e) =>
        `/realms/${i.realm}/client-storage/providers/${e.providerId}/${e.id}`),
      (e.getInstanceName = (e) => e.name),
      (e.getInstanceProvider = (e) => e.providerId),
      (e.isProviderEnabled = (e) =>
        !e.config.enabled || 'true' === e.config.enabled[0]),
      (e.getInstancePriority = (e) =>
        e.config.priority ? e.config.priority[0] : '0'),
      o.query(
        {
          realm: i.realm,
          parent: i.id,
          type: 'org.keycloak.storage.client.ClientStorageProvider',
        },
        (t) => {
          (e.instances = t), (e.instancesLoaded = !0);
        },
      ),
      (e.removeInstance = (e) => {
        a.confirmDelete(e.name, 'client storage provider', () => {
          o.remove({ realm: i.realm, componentId: e.id }, () => {
            n.reload(), r.success('The provider has been deleted.');
          });
        });
      });
  }),
  module.controller(
    'GenericClientStorageCtrl',
    (e, t, n, i, _l, o, r, a, c, s) => {
      console.log('GenericClientStorageCtrl'),
        console.log(`providerId: ${c}`),
        (e.create = !a.providerId),
        console.log(`create: ${e.create}`);
      var u =
        r.componentTypes['org.keycloak.storage.client.ClientStorageProvider'];
      console.log(`providers length ${u.length}`);
      for (var d = null, p = 0; p < u.length; p++) {
        var m = u[p];
        if ((console.log(`provider: ${m.id}`), m.id === c)) {
          (e.providerFactory = m), (d = m);
          break;
        }
      }
      (e.changed = !1),
        console.log(`providerFactory: ${d.id}`),
        (() => {
          if (e.create) {
            if (
              ((e.changed = !0),
              (a.name = d.id),
              (a.providerId = d.id),
              (a.providerType =
                'org.keycloak.storage.client.ClientStorageProvider'),
              (a.parentId = o.id),
              (a.config = {}),
              (a.config.priority = ['0']),
              (a.config.enabled = ['true']),
              (e.fullSyncEnabled = !1),
              (e.changedSyncEnabled = !1),
              (a.config.cachePolicy = ['DEFAULT']),
              (a.config.evictionDay = ['']),
              (a.config.evictionHour = ['']),
              (a.config.evictionMinute = ['']),
              (a.config.maxLifespan = ['']),
              d.properties)
            )
              for (var t = 0; t < d.properties.length; t++) {
                (n = d.properties[t]).defaultValue
                  ? (a.config[n.name] = [n.defaultValue])
                  : (a.config[n.name] = ['']);
              }
          } else if (
            ((e.changed = !1),
            a.config.enabled || (a.config.enabled = ['true']),
            a.config.cachePolicy || (a.config.cachePolicy = ['DEFAULT']),
            a.config.evictionDay || (a.config.evictionDay = ['']),
            a.config.evictionHour || (a.config.evictionHour = ['']),
            a.config.evictionMinute || (a.config.evictionMinute = ['']),
            a.config.maxLifespan || (a.config.maxLifespan = ['']),
            a.config.priority || (a.config.priority = ['0']),
            d.properties)
          )
            for (t = 0; t < d.properties.length; t++) {
              var n = d.properties[t];
              a.config[n.name] || (a.config[n.name] = ['']);
            }
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
        (e.save = () => {
          console.log('save provider'),
            (e.changed = !1),
            e.create
              ? (console.log('saving new provider'),
                s.save({ realm: o.realm }, e.instance, (_i, l) => {
                  var r = l().location,
                    a = r.substring(r.lastIndexOf('/') + 1);
                  t.url(
                    `/realms/${o.realm}/client-storage/providers/${e.instance.providerId}/${a}`,
                  ),
                    n.success('The provider has been created.');
                }))
              : (console.log('update existing provider'),
                s.update(
                  { realm: o.realm, componentId: a.id },
                  e.instance,
                  () => {
                    i.reload(), n.success('The provider has been updated.');
                  },
                ));
        }),
        (e.reset = () => {
          i.reload();
        }),
        (e.cancel = () => {
          console.log('cancel'),
            e.create ? t.url(`/realms/${o.realm}/client-stores`) : i.reload();
        });
    },
  );
