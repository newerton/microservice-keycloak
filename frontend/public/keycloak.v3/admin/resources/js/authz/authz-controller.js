module.controller('ResourceServerCtrl', (e, t, r) => {
  (e.realm = t),
    r.query({ realm: t.realm }, (t) => {
      e.servers = t;
    });
}),
  module.controller(
    'ResourceServerDetailCtrl',
    (e, _t, r, _i, _n, l, s, c, o, _a, u) => {
      (e.realm = s),
        (e.client = o),
        c.get({ realm: r.current.params.realm, client: o.id }, (t) => {
          (e.server = angular.copy(t)),
            (e.changed = !1),
            e.$watch(
              'server',
              () => {
                angular.equals(e.server, t) || (e.changed = !0);
              },
              !0,
            ),
            (e.save = () => {
              c.update(
                { realm: s.realm, client: e.server.clientId },
                e.server,
                () => {
                  r.reload(),
                    u.success('The resource server has been created.');
                },
              );
            }),
            (e.reset = () => {
              r.reload();
            }),
            (e.export = () => {
              (e.exportSettings = !0),
                c.settings(
                  { realm: r.current.params.realm, client: o.id },
                  (t) => {
                    var r = angular.fromJson(t);
                    e.settings = angular.toJson(r, !0);
                  },
                );
            }),
            (e.downloadSettings = () => {
              saveAs(
                new Blob([e.settings], { type: 'application/json' }),
                `${e.server.name}-authz-config.json`,
              );
            }),
            (e.cancelExport = () => {
              delete e.settings;
            }),
            (e.onFileSelect = (t) => {
              (e.server = angular.copy(JSON.parse(t))), (e.importing = !0);
            }),
            (e.viewImportDetails = () => {
              l.open({
                templateUrl: `${resourceUrl}/partials/modal/view-object.html`,
                controller: 'ObjectModalCtrl',
                resolve: { object: () => e.server },
              });
            }),
            (e.import = () => {
              c.import({ realm: s.realm, client: o.id }, e.server, () => {
                r.reload(), u.success('The resource server has been updated.');
              });
            });
        });
    },
  );
var Resources = {
    delete: (e, t, r, n, l, s, c, o) => {
      e.permissions({ realm: t, client: r.id, rsrid: n.resource._id }, (r) => {
        var a = '';
        if (r.length > 0 && !n.deleteConsent) {
          for (
            a = '<p>This resource is referenced in some permissions:</p>',
              a += '<ul>',
              i = 0;
            i < r.length;
            i++
          )
            a += `<li><strong>${r[i].name}</strong></li>`;
          (a += '</ul>'),
            (a +=
              '<p>If you remove this resource, the permissions above will be affected and will not be associated with this resource anymore.</p>');
        }
        l.confirmDeleteWithMsg(n.resource.name, 'Resource', a, () => {
          e.delete(
            { realm: t, client: n.client.id, rsrid: n.resource._id },
            null,
            () => {
              s.url(
                `/realms/${t}/clients/${n.client.id}/authz/resource-server/resource`,
              ),
                o.reload(),
                c.success('The resource has been deleted.');
            },
          );
        });
      });
    },
  },
  Policies = {
    delete: (e, t, r, n, l, s, c, o, a) => {
      var u = '';
      e.dependentPolicies({ realm: t, client: r.id, id: n.policy.id }, (r) => {
        if (r.length > 0 && !n.deleteConsent) {
          for (
            u = '<p>This policy is being used by other policies:</p>',
              u += '<ul>',
              i = 0;
            i < r.length;
            i++
          )
            u += `<li><strong>${r[i].name}</strong></li>`;
          (u += '</ul>'),
            (u +=
              '<p>If you remove this policy, the policies above will be affected and will not be associated with this policy anymore.</p>');
        }
        l.confirmDeleteWithMsg(
          n.policy.name,
          a ? 'Permission' : 'Policy',
          u,
          () => {
            e.delete(
              { realm: t, client: n.client.id, id: n.policy.id },
              null,
              () => {
                a
                  ? (s.url(
                      `/realms/${t}/clients/${n.client.id}/authz/resource-server/permission`,
                    ),
                    c.success('The permission has been deleted.'))
                  : (s.url(
                      `/realms/${t}/clients/${n.client.id}/authz/resource-server/policy`,
                    ),
                    c.success('The policy has been deleted.')),
                  o.reload();
              },
            );
          },
        );
      });
    },
  };
module.controller(
  'ResourceServerResourceCtrl',
  (e, _t, r, n, l, s, c, o, a, u, d) => {
    (e.realm = l),
      (e.client = o),
      (e.query = { realm: l.realm, client: o.id, deep: !1, max: 20, first: 0 }),
      (e.listSizes = [5, 10, 20]),
      s.get({ realm: r.current.params.realm, client: o.id }, (t) => {
        (e.server = t),
          (e.createPolicy = (e) => {
            (d.state = {}),
              (d.state.previousUrl = `/realms/${r.current.params.realm}/clients/${o.id}/authz/resource-server/resource`),
              n
                .path(
                  `/realms/${r.current.params.realm}/clients/${o.id}/authz/resource-server/permission/resource/create`,
                )
                .search({ rsrid: e._id });
          }),
          e.searchQuery();
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
          c.query(e.query, (t) => {
            (e.searchLoaded = !0),
              (e.lastSearch = e.query.search),
              (e.resources = t),
              e.detailsFilter && e.showDetails();
          });
      }),
      (e.loadDetails = (e) => {
        e.details
          ? (e.details.loaded = !e.details.loaded)
          : ((e.details = { loaded: !1 }),
            c.scopes(
              { realm: r.current.params.realm, client: o.id, rsrid: e._id },
              (t) => {
                (e.scopes = t),
                  c.permissions(
                    {
                      realm: r.current.params.realm,
                      client: o.id,
                      rsrid: e._id,
                    },
                    (t) => {
                      (e.policies = t), (e.details.loaded = !0);
                    },
                  );
              },
            ));
      }),
      (e.showDetails = (t, r) => {
        if ('a' !== r.target.localName && 'button' !== r.target.localName)
          if (t) e.loadDetails(t);
          else
            for (i = 0; i < e.resources.length; i++)
              e.loadDetails(e.resources[i]);
      }),
      (e.delete = (t) => {
        (e.resource = t),
          Resources.delete(c, r.current.params.realm, o, e, a, n, u, r);
      });
  },
),
  module.controller(
    'ResourceServerResourceDetailCtrl',
    function (e, _t, r, n, l, s, c, o, a, u, d) {
      (e.realm = l),
        (e.client = c),
        (e.scopesUiSelect = {
          minimumInputLength: 1,
          delay: 500,
          allowClear: !0,
          query: (t) => {
            var r = { results: [] };
            '' !== t.term.trim()
              ? ((e.query = {
                  realm: l.realm,
                  client: c.id,
                  name: t.term.trim(),
                  deep: !1,
                  max: 20,
                  first: 0,
                }),
                a.query(e.query, (e) => {
                  (r.results = e), t.callback(r);
                }))
              : t.callback(r);
          },
          formatResult: (e, _t, _r) => e.name,
          formatSelection: (e, _t, _r) => e.name,
        });
      s.get({ realm: r.current.params.realm, client: c.id }, (t) => {
        if (((e.server = t), r.current.params.rsrid))
          o.get(
            {
              realm: r.current.params.realm,
              client: c.id,
              rsrid: r.current.params.rsrid,
            },
            (t) => {
              t.scopes || (t.scopes = []),
                t.attributes || (t.attributes = {}),
                (e.resource = angular.copy(t)),
                (e.changed = !1),
                (e.originalResource = angular.copy(e.resource)),
                e.$watch(
                  'resource',
                  () => {
                    angular.equals(e.resource, t) || (e.changed = !0);
                  },
                  !0,
                ),
                e.$watch(
                  'newUri',
                  () => {
                    e.newUri && e.newUri.length > 0 && (e.changed = !0);
                  },
                  !0,
                ),
                (e.save = () => {
                  for (
                    e.newUri && e.newUri.length > 0 && e.addUri(), i = 0;
                    i < e.resource.scopes.length;
                    i++
                  )
                    delete e.resource.scopes[i].text;
                  for (
                    var t = Object.keys(e.resource.attributes), n = 0;
                    n < t.length;
                    n++
                  ) {
                    var s = t[n],
                      c = e.resource.attributes[s].toString().split(',');
                    for (
                      e.resource.attributes[s] = [], j = 0;
                      j < c.length;
                      j++
                    )
                      e.resource.attributes[s].push(c[j]);
                  }
                  this.checkNameAvailability(() => {
                    o.update(
                      {
                        realm: l.realm,
                        client: e.client.id,
                        rsrid: e.resource._id,
                      },
                      e.resource,
                      () => {
                        r.reload(), d.success('The resource has been updated.');
                      },
                    );
                  });
                }),
                (e.remove = () => {
                  Resources.delete(o, r.current.params.realm, c, e, u, n, d, r);
                }),
                (e.reset = () => {
                  r.reload();
                });
            },
          );
        else {
          (e.create = !0), (e.changed = !1);
          var s = { scopes: [], attributes: {}, uris: [] };
          (e.resource = angular.copy(s)),
            e.$watch(
              'resource',
              () => {
                angular.equals(e.resource, s) || (e.changed = !0);
              },
              !0,
            ),
            e.$watch(
              'newUri',
              () => {
                e.newUri && e.newUri.length > 0 && (e.changed = !0);
              },
              !0,
            ),
            (e.save = () => {
              for (
                e.newUri && e.newUri.length > 0 && e.addUri(), i = 0;
                i < e.resource.scopes.length;
                i++
              )
                delete e.resource.scopes[i].text;
              this.checkNameAvailability(() => {
                o.save(
                  { realm: l.realm, client: e.client.id },
                  e.resource,
                  (t) => {
                    n.url(
                      `/realms/${l.realm}/clients/${e.client.id}/authz/resource-server/resource/${t._id}`,
                    ),
                      d.success('The resource has been created.');
                  },
                );
              });
            }),
            (e.reset = () => {
              n.url(
                `/realms/${l.realm}/clients/${e.client.id}/authz/resource-server/resource/`,
              );
            });
        }
      }),
        (e.checkNewNameAvailability = () => {
          this.checkNameAvailability(() => {});
        }),
        (this.checkNameAvailability = (t) => {
          e.resource.name &&
            0 !== e.resource.name.trim().length &&
            o.search(
              {
                realm: r.current.params.realm,
                client: c.id,
                rsrid: r.current.params.rsrid,
                name: e.resource.name,
              },
              (r) => {
                r?._id && r._id !== e.resource._id
                  ? d.error(
                      'Name already in use by another resource, please choose another one.',
                    )
                  : t();
              },
            );
        }),
        (e.addAttribute = () => {
          (e.resource.attributes[e.newAttribute.key] = e.newAttribute.value),
            delete e.newAttribute;
        }),
        (e.removeAttribute = (t) => {
          delete e.resource.attributes[t];
        }),
        (e.addUri = () => {
          e.resource.uris.push(e.newUri), (e.newUri = '');
        }),
        (e.deleteUri = (t) => {
          e.resource.uris.splice(t, 1);
        });
    },
  );
var Scopes = {
  delete: (e, t, r, n, l, s, c, o) => {
    e.permissions({ realm: t, client: r.id, id: n.scope.id }, (r) => {
      var a = '';
      if (r.length > 0 && !n.deleteConsent) {
        for (
          a = '<p>This scope is referenced in some permissions:</p>',
            a += '<ul>',
            i = 0;
          i < r.length;
          i++
        )
          a += `<li><strong>${r[i].name}</strong></li>`;
        (a += '</ul>'),
          (a +=
            '<p>If you remove this scope, the permissions above will be affected and will not be associated with this scope anymore.</p>');
      }
      l.confirmDeleteWithMsg(n.scope.name, 'Scope', a, () => {
        e.delete(
          { realm: t, client: n.client.id, id: n.scope.id },
          null,
          () => {
            s.url(
              `/realms/${t}/clients/${n.client.id}/authz/resource-server/scope`,
            ),
              o.reload(),
              c.success('The scope has been deleted.');
          },
        );
      });
    });
  },
};
module.controller(
  'ResourceServerScopeCtrl',
  (e, _t, r, n, l, s, c, o, a, u, d) => {
    (e.realm = l),
      (e.client = o),
      (e.query = { realm: l.realm, client: o.id, deep: !1, max: 20, first: 0 }),
      (e.listSizes = [5, 10, 20]),
      s.get({ realm: r.current.params.realm, client: o.id }, (t) => {
        (e.server = t),
          (e.createPolicy = (e) => {
            (d.state = {}),
              (d.state.previousUrl = `/realms/${r.current.params.realm}/clients/${o.id}/authz/resource-server/scope`),
              n
                .path(
                  `/realms/${r.current.params.realm}/clients/${o.id}/authz/resource-server/permission/scope/create`,
                )
                .search({ scpid: e.id });
          }),
          e.searchQuery();
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
      (e.searchQuery = (_t) => {
        (e.searchLoaded = !1),
          c.query(e.query, (t) => {
            (e.scopes = t),
              (e.searchLoaded = !0),
              (e.lastSearch = e.query.search),
              e.detailsFilter && e.showDetails();
          });
      }),
      (e.loadDetails = (e) => {
        e.details
          ? (e.details.loaded = !e.details.loaded)
          : ((e.details = { loaded: !1 }),
            c.resources(
              { realm: r.current.params.realm, client: o.id, id: e.id },
              (t) => {
                (e.resources = t),
                  c.permissions(
                    { realm: r.current.params.realm, client: o.id, id: e.id },
                    (t) => {
                      (e.policies = t), (e.details.loaded = !0);
                    },
                  );
              },
            ));
      }),
      (e.showDetails = (t, r) => {
        if ('a' !== r.target.localName && 'button' !== r.target.localName)
          if (t) e.loadDetails(t);
          else for (i = 0; i < e.scopes.length; i++) e.loadDetails(e.scopes[i]);
      }),
      (e.delete = (t) => {
        (e.scope = t),
          Scopes.delete(c, r.current.params.realm, o, e, a, n, u, r);
      });
  },
),
  module.controller(
    'ResourceServerScopeDetailCtrl',
    function (e, _t, r, i, n, l, s, c, o, a) {
      (e.realm = n), (e.client = s);
      l.get({ realm: r.current.params.realm, client: s.id }, (t) => {
        if (((e.server = t), r.current.params.id))
          c.get(
            {
              realm: r.current.params.realm,
              client: s.id,
              id: r.current.params.id,
            },
            (t) => {
              (e.scope = angular.copy(t)),
                (e.changed = !1),
                e.$watch(
                  'scope',
                  () => {
                    angular.equals(e.scope, t) || (e.changed = !0);
                  },
                  !0,
                ),
                (e.originalScope = angular.copy(e.scope)),
                (e.save = () => {
                  this.checkNameAvailability(() => {
                    c.update(
                      { realm: n.realm, client: e.client.id, id: e.scope.id },
                      e.scope,
                      () => {
                        (e.changed = !1),
                          a.success('The scope has been updated.');
                      },
                    );
                  });
                }),
                (e.remove = () => {
                  Scopes.delete(c, r.current.params.realm, s, e, o, i, a, r);
                }),
                (e.reset = () => {
                  r.reload();
                });
            },
          );
        else {
          (e.create = !0), (e.changed = !1);
          var l = {};
          (e.scope = angular.copy(l)),
            e.$watch(
              'scope',
              () => {
                angular.equals(e.scope, l) || (e.changed = !0);
              },
              !0,
            ),
            (e.save = () => {
              this.checkNameAvailability(() => {
                c.save(
                  { realm: n.realm, client: e.client.id },
                  e.scope,
                  (e) => {
                    i.url(
                      `/realms/${n.realm}/clients/${s.id}/authz/resource-server/scope/${e.id}`,
                    ),
                      a.success('The scope has been created.');
                  },
                );
              });
            }),
            (e.reset = () => {
              i.url(
                `/realms/${n.realm}/clients/${e.client.id}/authz/resource-server/scope/`,
              );
            });
        }
      }),
        (e.checkNewNameAvailability = () => {
          this.checkNameAvailability(() => {});
        }),
        (this.checkNameAvailability = (t) => {
          e.scope.name &&
            0 !== e.scope.name.trim().length &&
            c.search(
              {
                realm: r.current.params.realm,
                client: s.id,
                name: e.scope.name,
              },
              (r) => {
                r?.id && r.id !== e.scope.id
                  ? a.error(
                      'Name already in use by another scope, please choose another one.',
                    )
                  : t();
              },
            );
        });
    },
  ),
  module.controller(
    'ResourceServerPolicyCtrl',
    (e, _t, r, n, l, s, c, o, a, u, d, p) => {
      (e.realm = l),
        (e.client = a),
        (e.policyProviders = []),
        (e.query = {
          realm: l.realm,
          client: a.id,
          permission: !1,
          max: 20,
          first: 0,
        }),
        (e.listSizes = [5, 10, 20]),
        o.query({ realm: r.current.params.realm, client: a.id }, (t) => {
          for (i = 0; i < t.length; i++)
            'resource' !== t[i].type &&
              'scope' !== t[i].type &&
              e.policyProviders.push(t[i]);
        }),
        s.get({ realm: r.current.params.realm, client: a.id }, (t) => {
          (e.server = t), e.searchQuery();
        }),
        (e.addPolicy = (e) => {
          p.endsWith(e.type, '.js')
            ? c.save(
                { realm: l.realm, client: a.id, type: e.type },
                { name: e.name, type: e.type },
                (_e) => {
                  n.url(
                    `/realms/${l.realm}/clients/${a.id}/authz/resource-server/policy/`,
                  ),
                    d.success('The policy has been created.');
                },
              )
            : n.url(
                `/realms/${l.realm}/clients/${a.id}/authz/resource-server/policy/${e.type}/create`,
              );
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
            c.query(e.query, (t) => {
              (e.policies = t),
                (e.searchLoaded = !0),
                (e.lastSearch = e.query.search),
                e.detailsFilter && e.showDetails();
            });
        }),
        (e.loadDetails = (e) => {
          e.details
            ? (e.details.loaded = !e.details.loaded)
            : ((e.details = { loaded: !1 }),
              c.dependentPolicies(
                { realm: r.current.params.realm, client: a.id, id: e.id },
                (t) => {
                  (e.dependentPolicies = t), (e.details.loaded = !0);
                },
              ));
        }),
        (e.showDetails = (t, r) => {
          if ('a' !== r.target.localName && 'button' !== r.target.localName)
            if (t) e.loadDetails(t);
            else
              for (i = 0; i < e.policies.length; i++)
                e.loadDetails(e.policies[i]);
        }),
        (e.delete = (t) => {
          (e.policy = t),
            Policies.delete(c, r.current.params.realm, a, e, u, n, d, r, !1);
        });
    },
  ),
  module.controller(
    'ResourceServerPermissionCtrl',
    (e, _t, r, n, l, s, c, o, a, u, d) => {
      (e.realm = l),
        (e.client = a),
        (e.policyProviders = []),
        (e.query = { realm: l.realm, client: a.id, max: 20, first: 0 }),
        (e.listSizes = [5, 10, 20]),
        o.query({ realm: r.current.params.realm, client: a.id }, (t) => {
          for (i = 0; i < t.length; i++)
            ('resource' !== t[i].type && 'scope' !== t[i].type) ||
              e.policyProviders.push(t[i]);
        }),
        s.get({ realm: r.current.params.realm, client: a.id }, (t) => {
          (e.server = t), e.searchQuery();
        }),
        (e.addPolicy = (e) => {
          n.url(
            `/realms/${l.realm}/clients/${a.id}/authz/resource-server/permission/${e.type}/create`,
          );
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
            c.query(e.query, (t) => {
              (e.policies = t),
                (e.searchLoaded = !0),
                (e.lastSearch = e.query.search),
                e.detailsFilter && e.showDetails();
            });
        }),
        (e.loadDetails = (e) => {
          e.details
            ? (e.details.loaded = !e.details.loaded)
            : ((e.details = { loaded: !1 }),
              c.associatedPolicies(
                { realm: r.current.params.realm, client: a.id, id: e.id },
                (t) => {
                  (e.associatedPolicies = t), (e.details.loaded = !0);
                },
              ));
        }),
        (e.showDetails = (t, r) => {
          if ('a' !== r.target.localName && 'button' !== r.target.localName)
            if (t) e.loadDetails(t);
            else
              for (i = 0; i < e.policies.length; i++)
                e.loadDetails(e.policies[i]);
        }),
        (e.delete = (t) => {
          (e.policy = t),
            Policies.delete(c, r.current.params.realm, a, e, u, n, d, r, !0);
        });
    },
  ),
  module.controller(
    'ResourceServerPolicyResourceDetailCtrl',
    (e, t, r, n, l, s, c, o, a) => {
      s.onInit(
        {
          getPolicyType: () => 'resource',
          isPermission: () => !0,
          onInit: () => {
            (e.resourcesUiSelect = {
              minimumInputLength: 1,
              delay: 500,
              allowClear: !0,
              id: (e) => e._id,
              query: (t) => {
                var r = { results: [] };
                '' !== t.term.trim()
                  ? ((e.query = {
                      realm: n.realm,
                      client: l.id,
                      name: t.term.trim(),
                      deep: !1,
                      max: 20,
                      first: 0,
                    }),
                    o.query(e.query, (e) => {
                      (r.results = e), t.callback(r);
                    }))
                  : t.callback(r);
              },
              formatResult: (e, _t, _r) => ((e.text = e.name), e.name),
            }),
              (e.policiesUiSelect = {
                minimumInputLength: 1,
                delay: 500,
                allowClear: !0,
                query: (t) => {
                  var r = { results: [] };
                  '' !== t.term.trim()
                    ? ((e.query = {
                        realm: n.realm,
                        client: l.id,
                        permission: !1,
                        name: t.term.trim(),
                        max: 20,
                        first: 0,
                      }),
                      c.searchPolicies(e.query, (e) => {
                        (r.results = e), t.callback(r);
                      }))
                    : t.callback(r);
                },
                formatResult: (e, _t, _r) => ((e.text = e.name), e.name),
              }),
              (e.applyToResourceType = () => {
                e.applyToResourceTypeFlag
                  ? (e.selectedResource = null)
                  : (e.policy.resourceType = null);
              });
          },
          onInitUpdate: (r) => {
            r.resourceType
              ? (e.applyToResourceTypeFlag = !0)
              : ((e.selectedResource = {}),
                c.resources(
                  { realm: t.current.params.realm, client: l.id, id: r.id },
                  (t) => {
                    (t[0].text = t[0].name), (e.selectedResource = t[0]);
                    var r = angular.copy(e.selectedResource);
                    e.$watch(
                      'selectedResource',
                      () => {
                        angular.equals(e.selectedResource, r) ||
                          (e.changed = !0);
                      },
                      !0,
                    );
                  },
                )),
              c.associatedPolicies(
                { realm: t.current.params.realm, client: l.id, id: r.id },
                (t) => {
                  for (e.selectedPolicies = [], i = 0; i < t.length; i++)
                    (t[i].text = t[i].name), e.selectedPolicies.push(t[i]);
                  var r = angular.copy(e.selectedPolicies);
                  e.$watch(
                    'selectedPolicies',
                    () => {
                      angular.equals(e.selectedPolicies, r) || (e.changed = !0);
                    },
                    !0,
                  );
                },
              );
          },
          onUpdate: () => {
            e.selectedResource?._id
              ? ((e.policy.resources = []),
                e.policy.resources.push(e.selectedResource._id))
              : (e.policy.resources = []);
            var t = [];
            for (i = 0; i < e.selectedPolicies.length; i++)
              t.push(e.selectedPolicies[i].id);
            (e.policy.policies = t), delete e.policy.config;
          },
          onInitCreate: (_i) => {
            (a.state.previousPage.name = 'authz-add-resource-permission'),
              (e.selectedResource = null);
            var n = angular.copy(e.selectedResource);
            e.$watch(
              'selectedResource',
              () => {
                angular.equals(e.selectedResource, n) || (e.changed = !0);
              },
              !0,
            ),
              (e.selectedPolicies = null);
            n = angular.copy(e.selectedPolicies);
            e.$watch(
              'selectedPolicies',
              () => {
                angular.equals(e.selectedPolicies, n) || (e.changed = !0);
              },
              !0,
            );
            var s = r.search().rsrid;
            s &&
              o.get(
                { realm: t.current.params.realm, client: l.id, rsrid: s },
                (t) => {
                  (t.text = t.name), (e.selectedResource = t);
                },
              );
          },
          onCreate: () => {
            e.selectedResource?._id
              ? ((e.policy.resources = []),
                e.policy.resources.push(e.selectedResource._id))
              : delete e.policy.resources;
            var t = [];
            if (e.selectedPolicies)
              for (i = 0; i < e.selectedPolicies.length; i++)
                t.push(e.selectedPolicies[i].id);
            (e.policy.policies = t), delete e.policy.config;
          },
          onSaveState: (_t) => {
            (a.state.selectedResource = e.selectedResource),
              (a.state.applyToResourceTypeFlag = e.applyToResourceTypeFlag);
          },
          onRestoreState: (t) => {
            (e.selectedResource = a.state.selectedResource),
              (e.applyToResourceTypeFlag = a.state.applyToResourceTypeFlag),
              (t.resourceType = a.state.policy.resourceType);
          },
        },
        n,
        l,
        e,
      );
    },
  ),
  module.controller(
    'ResourceServerPolicyScopeDetailCtrl',
    (e, t, r, n, l, s, c, o, a, u) => {
      s.onInit(
        {
          getPolicyType: () => 'scope',
          isPermission: () => !0,
          onInit: () => {
            (e.scopesUiSelect = {
              minimumInputLength: 1,
              delay: 500,
              allowClear: !0,
              query: (t) => {
                var r = { results: [] };
                '' !== t.term.trim()
                  ? ((e.query = {
                      realm: n.realm,
                      client: l.id,
                      name: t.term.trim(),
                      deep: !1,
                      max: 20,
                      first: 0,
                    }),
                    a.query(e.query, (e) => {
                      (r.results = e), t.callback(r);
                    }))
                  : t.callback(r);
              },
              formatResult: (e, _t, _r) => ((e.text = e.name), e.name),
            }),
              (e.resourcesUiSelect = {
                minimumInputLength: 1,
                delay: 500,
                allowClear: !0,
                id: (e) => e._id,
                query: (t) => {
                  var r = { results: [] };
                  '' !== t.term.trim()
                    ? ((e.query = {
                        realm: n.realm,
                        client: l.id,
                        name: t.term.trim(),
                        deep: !1,
                        max: 20,
                        first: 0,
                      }),
                      o.query(e.query, (e) => {
                        (r.results = e), t.callback(r);
                      }))
                    : t.callback(r);
                },
                formatResult: (e, _t, _r) => ((e.text = e.name), e.name),
              }),
              (e.policiesUiSelect = {
                minimumInputLength: 1,
                delay: 500,
                allowClear: !0,
                query: (t) => {
                  var r = { results: [] };
                  '' !== t.term.trim()
                    ? ((e.query = {
                        realm: n.realm,
                        client: l.id,
                        permission: !1,
                        name: t.term.trim(),
                        max: 20,
                        first: 0,
                      }),
                      c.query(e.query, (e) => {
                        (r.results = e), t.callback(r);
                      }))
                    : t.callback(r);
                },
                formatResult: (e, _t, _r) => ((e.text = e.name), e.name),
              }),
              (e.selectResource = () => {
                (e.selectedScopes = null),
                  e.selectedResource &&
                    o.scopes(
                      {
                        realm: t.current.params.realm,
                        client: l.id,
                        rsrid: e.selectedResource._id,
                      },
                      (t) => {
                        e.resourceScopes = t;
                      },
                    );
              });
          },
          onInitUpdate: (r) => {
            c.resources(
              { realm: t.current.params.realm, client: l.id, id: r.id },
              (n) => {
                if (n.length > 0) {
                  for (i = 0; i < n.length; i++)
                    o.get(
                      {
                        realm: t.current.params.realm,
                        client: l.id,
                        rsrid: n[0]._id,
                      },
                      (r) => {
                        o.query(
                          {
                            realm: t.current.params.realm,
                            client: l.id,
                            _id: r._id,
                            deep: !1,
                          },
                          (r) => {
                            (r[0].text = r[0].name),
                              (e.selectedResource = r[0]);
                            var i = angular.copy(e.selectedResource);
                            e.$watch(
                              'selectedResource',
                              () => {
                                angular.equals(e.selectedResource, i) ||
                                  (e.changed = !0);
                              },
                              !0,
                            ),
                              o.scopes(
                                {
                                  realm: t.current.params.realm,
                                  client: l.id,
                                  rsrid: r[0]._id,
                                },
                                (t) => {
                                  e.resourceScopes = t;
                                },
                              );
                          },
                        );
                      },
                    );
                  c.scopes(
                    { realm: t.current.params.realm, client: l.id, id: r.id },
                    (t) => {
                      for (e.selectedScopes = [], i = 0; i < t.length; i++)
                        (t[i].text = t[i].name), e.selectedScopes.push(t[i].id);
                      var r = angular.copy(e.selectedScopes);
                      e.$watch(
                        'selectedScopes',
                        () => {
                          angular.equals(e.selectedScopes, r) ||
                            (e.changed = !0);
                        },
                        !0,
                      );
                    },
                  );
                } else {
                  e.selectedResource = null;
                  var s = angular.copy(e.selectedResource);
                  e.$watch(
                    'selectedResource',
                    () => {
                      angular.equals(e.selectedResource, s) || (e.changed = !0);
                    },
                    !0,
                  ),
                    c.scopes(
                      { realm: t.current.params.realm, client: l.id, id: r.id },
                      (t) => {
                        for (e.selectedScopes = [], i = 0; i < t.length; i++)
                          (t[i].text = t[i].name), e.selectedScopes.push(t[i]);
                        var r = angular.copy(e.selectedScopes);
                        e.$watch(
                          'selectedScopes',
                          () => {
                            angular.equals(e.selectedScopes, r) ||
                              (e.changed = !0);
                          },
                          !0,
                        );
                      },
                    );
                }
              },
            ),
              c.associatedPolicies(
                { realm: t.current.params.realm, client: l.id, id: r.id },
                (t) => {
                  for (e.selectedPolicies = [], i = 0; i < t.length; i++)
                    (t[i].text = t[i].name), e.selectedPolicies.push(t[i]);
                  var r = angular.copy(e.selectedPolicies);
                  e.$watch(
                    'selectedPolicies',
                    () => {
                      angular.equals(e.selectedPolicies, r) || (e.changed = !0);
                    },
                    !0,
                  );
                },
              );
          },
          onUpdate: () => {
            null != e.selectedResource
              ? (e.policy.resources = [e.selectedResource._id])
              : (e.policy.resources = []);
            var t = [];
            for (i = 0; i < e.selectedScopes.length; i++)
              e.selectedScopes[i].id
                ? t.push(e.selectedScopes[i].id)
                : t.push(e.selectedScopes[i]);
            e.policy.scopes = t;
            var r = [];
            if (e.selectedPolicies)
              for (i = 0; i < e.selectedPolicies.length; i++)
                r.push(e.selectedPolicies[i].id);
            (e.policy.policies = r), delete e.policy.config;
          },
          onInitCreate: (_i) => {
            u.state.previousPage.name = 'authz-add-scope-permission';
            var n = r.search().scpid;
            n &&
              a.get(
                { realm: t.current.params.realm, client: l.id, id: n },
                (t) => {
                  (t.text = t.name),
                    e.policy.scopes || (e.selectedScopes = []),
                    e.selectedScopes.push(t);
                },
              );
          },
          onCreate: () => {
            null != e.selectedResource &&
              (e.policy.resources = [e.selectedResource._id]);
            var t = [];
            for (i = 0; i < e.selectedScopes.length; i++)
              e.selectedScopes[i].id
                ? t.push(e.selectedScopes[i].id)
                : t.push(e.selectedScopes[i]);
            e.policy.scopes = t;
            var r = [];
            if (e.selectedPolicies)
              for (i = 0; i < e.selectedPolicies.length; i++)
                r.push(e.selectedPolicies[i].id);
            (e.policy.policies = r), delete e.policy.config;
          },
          onSaveState: (_t) => {
            (u.state.selectedScopes = e.selectedScopes),
              (u.state.selectedResource = e.selectedResource),
              (u.state.resourceScopes = e.resourceScopes);
          },
          onRestoreState: (_t) => {
            (e.selectedScopes = u.state.selectedScopes),
              (e.selectedResource = u.state.selectedResource),
              (e.resourceScopes = u.state.resourceScopes);
          },
        },
        n,
        l,
        e,
      );
    },
  ),
  module.controller(
    'ResourceServerPolicyUserDetailCtrl',
    (e, t, r, n, l, s) => {
      l.onInit(
        {
          getPolicyType: () => 'user',
          onInit: () => {
            (e.usersUiSelect = {
              minimumInputLength: 1,
              delay: 500,
              allowClear: !0,
              query: (e) => {
                var r = { results: [] };
                '' !== e.term.trim()
                  ? s.query(
                      {
                        realm: t.current.params.realm,
                        search: e.term.trim(),
                        max: 20,
                      },
                      (t) => {
                        (r.results = t), e.callback(r);
                      },
                    )
                  : e.callback(r);
              },
              formatResult: (e, _t, _r) => e.username,
            }),
              (e.selectedUsers = []),
              (e.selectUser = (t) => {
                if (t?.id) {
                  for (
                    e.selectedUser = null, i = 0;
                    i < e.selectedUsers.length;
                    i++
                  )
                    if (e.selectedUsers[i].id === t.id) return;
                  e.selectedUsers.push(t);
                }
              }),
              (e.removeFromList = (e, t) => {
                for (i = 0; i < angular.copy(e).length; i++)
                  t === e[i] && e.splice(i, 1);
              });
          },
          onInitUpdate: (r) => {
            var n = [];
            if (r.users) {
              var l = r.users;
              for (i = 0; i < l.length; i++)
                s.get({ realm: t.current.params.realm, userId: l[i] }, (t) => {
                  n.push(t), (e.selectedUsers = angular.copy(n));
                });
            }
            e.$watch(
              'selectedUsers',
              () => {
                angular.equals(e.selectedUsers, n)
                  ? (e.changed = !1)
                  : (e.changed = !0);
              },
              !0,
            );
          },
          onUpdate: () => {
            var t = [];
            for (i = 0; i < e.selectedUsers.length; i++)
              t.push(e.selectedUsers[i].id);
            (e.policy.users = t), delete e.policy.config;
          },
          onCreate: () => {
            var t = [];
            for (i = 0; i < e.selectedUsers.length; i++)
              t.push(e.selectedUsers[i].id);
            (e.policy.users = t), delete e.policy.config;
          },
        },
        r,
        n,
        e,
      );
    },
  ),
  module.controller(
    'ResourceServerPolicyClientDetailCtrl',
    (e, t, r, i, n, l) => {
      n.onInit(
        {
          getPolicyType: () => 'client',
          onInit: () => {
            clientSelectControl(e, t.current.params.realm, l),
              (e.selectedClients = []),
              (e.selectClient = (t) => {
                if (t?.id) {
                  e.selectedClient = null;
                  for (var r = 0; r < e.selectedClients.length; r++)
                    if (e.selectedClients[r].id === t.id) return;
                  e.selectedClients.push(t);
                }
              }),
              (e.removeFromList = (t) => {
                var r = e.selectedClients.indexOf(t);
                -1 !== r && e.selectedClients.splice(r, 1);
              });
          },
          onInitUpdate: (r) => {
            var i = [];
            if (r.clients)
              for (var n = r.clients, s = 0; s < n.length; s++)
                l.get({ realm: t.current.params.realm, client: n[s] }, (t) => {
                  i.push(t), (e.selectedClients = angular.copy(i));
                });
            e.$watch(
              'selectedClients',
              () => {
                angular.equals(e.selectedClients, i)
                  ? (e.changed = !1)
                  : (e.changed = !0);
              },
              !0,
            );
          },
          onUpdate: () => {
            for (var t = [], r = 0; r < e.selectedClients.length; r++)
              t.push(e.selectedClients[r].id);
            (e.policy.clients = t), delete e.policy.config;
          },
          onInitCreate: () => {
            var t = [];
            e.$watch(
              'selectedClients',
              () => {
                angular.equals(e.selectedClients, t) || (e.changed = !0);
              },
              !0,
            );
          },
          onCreate: () => {
            for (var t = [], r = 0; r < e.selectedClients.length; r++)
              t.push(e.selectedClients[r].id);
            (e.policy.clients = t), delete e.policy.config;
          },
        },
        r,
        i,
        e,
      );
    },
  ),
  module.controller(
    'ResourceServerPolicyRoleDetailCtrl',
    (e, t, r, n, l, s, c, o, a) => {
      c.onInit(
        {
          getPolicyType: () => 'role',
          onInit: () => {
            o.query({ realm: t.current.params.realm }, (t) => {
              e.roles = t;
            }),
              l.query({ realm: t.current.params.realm }, (t) => {
                e.clients = t;
              }),
              (e.selectedRoles = []),
              (e.selectRole = (t) => {
                if (t?.id) {
                  for (
                    e.selectedRole = null, i = 0;
                    i < e.selectedRoles.length;
                    i++
                  )
                    if (e.selectedRoles[i].id === t.id) return;
                  e.selectedRoles.push(t);
                  var r = [];
                  if (e.clientRoles) {
                    for (i = 0; i < e.clientRoles.length; i++)
                      e.clientRoles[i].id !== t.id && r.push(e.clientRoles[i]);
                    e.clientRoles = r;
                  }
                }
              }),
              (e.removeFromList = (t) => {
                e.clientRoles &&
                  e.selectedClient &&
                  e.selectedClient.id === t.containerId &&
                  e.clientRoles.push(t);
                var r = e.selectedRoles.indexOf(t);
                -1 !== r && e.selectedRoles.splice(r, 1);
              }),
              (e.selectClient = () => {
                e.selectedClient
                  ? s.query(
                      {
                        realm: t.current.params.realm,
                        client: e.selectedClient.id,
                      },
                      (t) => {
                        var r = [];
                        for (j = 0; j < t.length; j++) {
                          var n = !1;
                          for (i = 0; i < e.selectedRoles.length; i++)
                            if (e.selectedRoles[i].id === t[j].id) {
                              n = !0;
                              break;
                            }
                          n ||
                            ((t[j].container = {}),
                            (t[j].container.name = e.selectedClient.clientId),
                            r.push(t[j]));
                        }
                        e.clientRoles = r;
                      },
                    )
                  : (e.clientRoles = []);
              });
          },
          onInitUpdate: (r) => {
            var n = [];
            if (r.roles) {
              var l = r.roles;
              for (i = 0; i < l.length; i++)
                a.get({ realm: t.current.params.realm, role: l[i].id }, (t) => {
                  for (i = 0; i < l.length; i++)
                    l[i].id === t.id && (t.required = !!l[i].required);
                  for (i = 0; i < e.clients.length; i++)
                    e.clients[i].id === t.containerId &&
                      ((t.container = {}),
                      (t.container.name = e.clients[i].clientId));
                  n.push(t), (e.selectedRoles = angular.copy(n));
                });
            }
            e.$watch(
              'selectedRoles',
              () => {
                angular.equals(e.selectedRoles, n)
                  ? (e.changed = !1)
                  : (e.changed = !0);
              },
              !0,
            );
          },
          onUpdate: () => {
            var t = [];
            for (i = 0; i < e.selectedRoles.length; i++) {
              var r = {};
              (r.id = e.selectedRoles[i].id),
                e.selectedRoles[i].required &&
                  (r.required = e.selectedRoles[i].required),
                t.push(r);
            }
            (e.policy.roles = t), delete e.policy.config;
          },
          onCreate: () => {
            var t = [];
            for (i = 0; i < e.selectedRoles.length; i++) {
              var r = {};
              (r.id = e.selectedRoles[i].id),
                e.selectedRoles[i].required &&
                  (r.required = e.selectedRoles[i].required),
                t.push(r);
            }
            (e.policy.roles = t), delete e.policy.config;
          },
        },
        r,
        n,
        e,
      ),
        (e.hasRealmRole = () => {
          for (i = 0; i < e.selectedRoles.length; i++)
            if (!e.selectedRoles[i].clientRole) return !0;
          return !1;
        }),
        (e.hasClientRole = () => {
          for (i = 0; i < e.selectedRoles.length; i++)
            if (e.selectedRoles[i].clientRole) return !0;
          return !1;
        });
    },
  ),
  module.controller(
    'ResourceServerPolicyGroupDetailCtrl',
    (e, t, r, n, _l, s, c, o, a, u) => {
      o.onInit(
        {
          getPolicyType: () => 'group',
          onInit: () => {
            (e.tree = []),
              s.query({ realm: t.current.params.realm }, (t) => {
                (e.groups = t),
                  (e.groupList = [
                    { id: 'realm', name: u.instant('groups'), subGroups: t },
                  ]);
              });
            (e.getGroupClass = (e) =>
              'realm' === e.id
                ? 'pficon pficon-users'
                : ((e) =>
                      'realm' !== e.id &&
                      (!e.subGroups || 0 === e.subGroups.length))(e)
                  ? 'normal'
                  : e.subGroups.length && e.collapsed
                    ? 'collapsed'
                    : e.subGroups.length && !e.collapsed
                      ? 'expanded'
                      : 'collapsed'),
              (e.getSelectedClass = (t) =>
                t.selected
                  ? 'selected'
                  : e.cutNode && e.cutNode.id === t.id
                    ? 'cut'
                    : void 0),
              (e.selectGroup = (t) => {
                for (i = 0; i < e.selectedGroups.length; i++)
                  if (e.selectedGroups[i].id === t.id) return;
                'realm' !== t.id
                  ? (e.selectedGroups.push({ id: t.id, path: t.path }),
                    (e.changed = !0))
                  : a.error('You must choose a group');
              }),
              (e.extendChildren = (_t) => {
                e.changed = !0;
              }),
              (e.removeFromList = (t) => {
                var r = e.selectedGroups.indexOf(t);
                -1 !== r && (e.selectedGroups.splice(r, 1), (e.changed = !0));
              });
          },
          onInitCreate: (_t) => {
            var r = [];
            (e.selectedGroups = angular.copy(r)),
              e.$watch(
                'selectedGroups',
                () => {
                  angular.equals(e.selectedGroups, r)
                    ? (e.changed = o.isNewAssociatedPolicy())
                    : (e.changed = !0);
                },
                !0,
              );
          },
          onInitUpdate: (r) => {
            (e.selectedGroups = r.groups),
              angular.forEach(e.selectedGroups, (e, _r) => {
                c.get({ realm: t.current.params.realm, groupId: e.id }, (t) => {
                  e.path = t.path;
                });
              }),
              e.$watch(
                'selectedGroups',
                () => {
                  e.changed &&
                    (angular.equals(e.selectedGroups, selectedGroups)
                      ? (e.changed = !1)
                      : (e.changed = !0));
                },
                !0,
              );
          },
          onUpdate: () => {
            (e.policy.groups = e.selectedGroups), delete e.policy.config;
          },
          onCreate: () => {
            (e.policy.groups = e.selectedGroups), delete e.policy.config;
          },
        },
        r,
        n,
        e,
      );
    },
  ),
  module.controller(
    'ResourceServerPolicyJSDetailCtrl',
    (e, _t, _r, i, n, l, s) => {
      n.onInit(
        {
          getPolicyType: () => 'js',
          onInit: () => {
            (e.readOnly = !s.featureEnabled('UPLOAD_SCRIPTS')),
              (e.initEditor = (t) => {
                (t.$blockScrolling = 1 / 0),
                  t.setReadOnly(e.readOnly),
                  t.getSession().setMode('ace/mode/javascript');
              });
          },
          onInitUpdate: (_e) => {},
          onUpdate: () => {
            delete e.policy.config;
          },
          onInitCreate: (_e) => {},
          onCreate: () => {
            delete e.policy.config;
          },
        },
        i,
        l,
        e,
      );
    },
  ),
  module.controller(
    'ResourceServerPolicyTimeDetailCtrl',
    (e, _t, _r, i, n, l) => {
      function s() {
        void 0 !== e.policy.notBefore &&
          '' === e.policy.notBefore.trim() &&
          (e.policy.notBefore = null),
          void 0 !== e.policy.notOnOrAfter &&
            '' === e.policy.notOnOrAfter.trim() &&
            (e.policy.notOnOrAfter = null);
      }
      n.onInit(
        {
          getPolicyType: () => 'time',
          onInit: () => {},
          onInitUpdate: (e) => {
            e.dayMonth && (e.dayMonth = parseInt(e.dayMonth, 10)),
              e.dayMonthEnd && (e.dayMonthEnd = parseInt(e.dayMonthEnd, 10)),
              e.month && (e.month = parseInt(e.month, 10)),
              e.monthEnd && (e.monthEnd = parseInt(e.monthEnd, 10)),
              e.year && (e.year = parseInt(e.year, 10)),
              e.yearEnd && (e.yearEnd = parseInt(e.yearEnd, 10)),
              e.hour && (e.hour = parseInt(e.hour, 10)),
              e.hourEnd && (e.hourEnd = parseInt(e.hourEnd, 10)),
              e.minute && (e.minute = parseInt(e.minute, 10)),
              e.minuteEnd && (e.minuteEnd = parseInt(e.minuteEnd, 10));
          },
          onUpdate: () => {
            s(), delete e.policy.config;
          },
          onInitCreate: (_e) => {},
          onCreate: () => {
            s(), delete e.policy.config;
          },
        },
        i,
        l,
        e,
      ),
        (e.isRequired = () => {
          var t = e.policy;
          return (
            !t ||
            !(
              t.notOnOrAfter ||
              t.notBefore ||
              t.dayMonth ||
              t.month ||
              t.year ||
              t.hour ||
              t.minute
            )
          );
        });
    },
  ),
  module.controller(
    'ResourceServerPolicyAggregateDetailCtrl',
    (e, t, _r, n, l, s, c, _o, a) => {
      l.onInit(
        {
          getPolicyType: () => 'aggregate',
          onInit: () => {
            e.policiesUiSelect = {
              minimumInputLength: 1,
              delay: 500,
              allowClear: !0,
              query: (t) => {
                var r = { results: [] };
                '' !== t.term.trim()
                  ? ((e.query = {
                      realm: n.realm,
                      client: c.id,
                      permission: !1,
                      name: t.term.trim(),
                      max: 20,
                      first: 0,
                    }),
                    s.query(e.query, (e) => {
                      (r.results = e), t.callback(r);
                    }))
                  : t.callback(r);
              },
              formatResult: (e, _t, _r) => ((e.text = e.name), e.name),
            };
          },
          onInitUpdate: (r) => {
            s.associatedPolicies(
              { realm: t.current.params.realm, client: c.id, id: r.id },
              (t) => {
                for (e.selectedPolicies = [], i = 0; i < t.length; i++)
                  (t[i].text = t[i].name), e.selectedPolicies.push(t[i]);
                var r = angular.copy(e.selectedPolicies);
                e.$watch(
                  'selectedPolicies',
                  () => {
                    angular.equals(e.selectedPolicies, r) || (e.changed = !0);
                  },
                  !0,
                );
              },
            );
          },
          onUpdate: () => {
            var t = [];
            for (i = 0; i < e.selectedPolicies.length; i++)
              t.push(e.selectedPolicies[i].id);
            (e.policy.policies = t), delete e.policy.config;
          },
          onInitCreate: (_e) => {
            a.state.previousPage.name = 'authz-add-aggregated-policy';
          },
          onCreate: () => {
            var t = [];
            for (i = 0; i < e.selectedPolicies.length; i++)
              t.push(e.selectedPolicies[i].id);
            (e.policy.policies = t), delete e.policy.config;
          },
        },
        n,
        c,
        e,
      );
    },
  ),
  module.controller(
    'ResourceServerPolicyClientScopeDetailCtrl',
    (e, t, r, n, l, s) => {
      s.onInit(
        {
          getPolicyType: () => 'client-scope',
          onInit: () => {
            l.query({ realm: t.current.params.realm }, (t) => {
              e.clientScopes = t;
            }),
              (e.selectedClientScopes = []),
              (e.selectClientScope = (t) => {
                if (t?.id) {
                  for (
                    e.selectedClientScope = null, i = 0;
                    i < e.selectedClientScopes.length;
                    i++
                  )
                    if (e.selectedClientScopes[i].id === t.id) return;
                  e.selectedClientScopes.push(t);
                }
              }),
              (e.removeFromList = (t) => {
                var r = e.selectedClientScopes.indexOf(t);
                -1 !== r && e.selectedClientScopes.splice(r, 1);
              });
          },
          onInitUpdate: (r) => {
            var n = [];
            if (r.clientScopes) {
              var s = r.clientScopes;
              for (i = 0; i < s.length; i++)
                l.get(
                  { realm: t.current.params.realm, clientScope: s[i].id },
                  (t) => {
                    for (i = 0; i < s.length; i++)
                      s[i].id === t.id && (t.required = !!s[i].required);
                    n.push(t), (e.selectedClientScopes = angular.copy(n));
                  },
                );
            }
            e.$watch(
              'selectedClientScopes',
              () => {
                angular.equals(e.selectedClientScopes, n)
                  ? (e.changed = !1)
                  : (e.changed = !0);
              },
              !0,
            );
          },
          onUpdate: () => {
            var t = [];
            for (i = 0; i < e.selectedClientScopes.length; i++) {
              var r = {};
              (r.id = e.selectedClientScopes[i].id),
                e.selectedClientScopes[i].required &&
                  (r.required = e.selectedClientScopes[i].required),
                t.push(r);
            }
            (e.policy.clientScopes = t), delete e.policy.config;
          },
          onCreate: () => {
            var t = [];
            for (i = 0; i < e.selectedClientScopes.length; i++) {
              var r = {};
              (r.id = e.selectedClientScopes[i].id),
                e.selectedClientScopes[i].required &&
                  (r.required = e.selectedClientScopes[i].required),
                t.push(r);
            }
            (e.policy.clientScopes = t), delete e.policy.config;
          },
        },
        r,
        n,
        e,
      );
    },
  ),
  module.service('PolicyController', (_e, t, r, n, l, s, c, o, a, u, d) => {
    var p = {
      isNewAssociatedPolicy: () => null != t.current.params.new_policy,
      isBackNewAssociatedPolicy: () => null != t.current.params.back,
      onInit: function (e, m, f, y) {
        (y.policyProviders = []),
          u.query({ realm: t.current.params.realm, client: f.id }, (e) => {
            for (i = 0; i < e.length; i++)
              'resource' !== e[i].type &&
                'scope' !== e[i].type &&
                y.policyProviders.push(e[i]);
          }),
          (a.state && p.isBackNewAssociatedPolicy()) ||
            p.isNewAssociatedPolicy() ||
            (a.state = {}),
          a.state.previousPage || (a.state.previousPage = {}),
          (y.policyViewState = a),
          (y.addPolicy = (t) => {
            (a.state.policy = y.policy),
              e.onSaveState?.(y.policy),
              y.selectedPolicies &&
                (a.state.selectedPolicies = y.selectedPolicies);
            var i = window.location.href.substring(
              window.location.href.indexOf('/realms'),
            );
            -1 === i.indexOf('back=true') &&
              (i = `${i + (-1 === i.indexOf('?') ? '?' : '&')}back=true`),
              (a.state.previousUrl = i),
              r.url(
                `/realms/${m.realm}/clients/${f.id}/authz/resource-server/policy/${t.type}/create?new_policy=true`,
              );
          }),
          (y.detailPolicy = (t) => {
            (a.state.policy = y.policy),
              e.onSaveState?.(y.policy),
              y.selectedPolicies &&
                (a.state.selectedPolicies = y.selectedPolicies);
            var i = window.location.href.substring(
              window.location.href.indexOf('/realms'),
            );
            -1 === i.indexOf('back=true') &&
              (i = `${i + (-1 === i.indexOf('?') ? '?' : '&')}back=true`),
              (a.state.previousUrl = i),
              r.url(
                `/realms/${m.realm}/clients/${f.id}/authz/resource-server/policy/${t.type}/${t.id}?new_policy=true`,
              );
          }),
          (y.removePolicy = (e, t) => {
            for (i = 0; i < angular.copy(e).length; i++)
              t.id === e[i].id && e.splice(i, 1);
          }),
          (y.selectPolicy = (e) => {
            if (e?.id) {
              for (
                y.selectedPolicies || (y.selectedPolicies = []),
                  y.selectedPolicy = null,
                  i = 0;
                i < y.selectedPolicies.length;
                i++
              )
                if (y.selectedPolicies[i].id === e.id) return;
              y.selectedPolicies.push(e);
            }
          }),
          (y.createNewPolicy = () => {
            y.showNewPolicy = !0;
          }),
          (y.cancelCreateNewPolicy = () => {
            y.showNewPolicy = !1;
          }),
          (y.historyBackOnSaveOrCancel = p.isNewAssociatedPolicy()),
          e.isPermission || (e.isPermission = () => !1);
        var h = l;
        e.isPermission() && (h = s),
          (y.realm = m),
          (y.client = f),
          (y.decisionStrategies = ['AFFIRMATIVE', 'UNANIMOUS', 'CONSENSUS']),
          (y.logics = ['POSITIVE', 'NEGATIVE']),
          e.onInit();
        n.get({ realm: t.current.params.realm, client: f.id }, (i) => {
          if (((y.server = i), t.current.params.id))
            h.get(
              {
                realm: m.realm,
                client: f.id,
                type: e.getPolicyType(),
                id: t.current.params.id,
              },
              (i) => {
                y.originalPolicy = i;
                var n = angular.copy(i);
                (y.changed =
                  y.historyBackOnSaveOrCancel || p.isBackNewAssociatedPolicy()),
                  (y.policy = angular.copy(n)),
                  p.isBackNewAssociatedPolicy()
                    ? (e.onRestoreState?.(y.policy), this.restoreState(y))
                    : e.onInitUpdate?.(y.policy),
                  y.$watch(
                    'policy',
                    () => {
                      angular.equals(y.policy, n) || (y.changed = !0);
                    },
                    !0,
                  ),
                  (y.save = () => {
                    this.checkNameAvailability(() => {
                      e.onUpdate?.(),
                        h.update(
                          {
                            realm: m.realm,
                            client: f.id,
                            type: y.policy.type,
                            id: y.policy.id,
                          },
                          y.policy,
                          () => {
                            e.isPermission()
                              ? (y.historyBackOnSaveOrCancel
                                  ? r.url(a.state.previousUrl)
                                  : r.url(
                                      `/realms/${m.realm}/clients/${f.id}/authz/resource-server/permission/${y.policy.type}/${y.policy.id}`,
                                    ),
                                t.reload(),
                                o.success('The permission has been updated.'))
                              : (y.historyBackOnSaveOrCancel
                                  ? r.url(a.state.previousUrl)
                                  : r.url(
                                      `/realms/${m.realm}/clients/${f.id}/authz/resource-server/policy/${y.policy.type}/${y.policy.id}`,
                                    ),
                                t.reload(),
                                o.success('The policy has been updated.'));
                          },
                        );
                    });
                  }),
                  (y.reset = () => {
                    if (y.historyBackOnSaveOrCancel) r.url(a.state.previousUrl);
                    else {
                      var t = angular.copy(i);
                      e.onInitUpdate?.(t),
                        (y.policy = angular.copy(t)),
                        (y.changed = !1);
                    }
                  });
              },
            ),
              (y.remove = () => {
                Policies.delete(
                  l,
                  t.current.params.realm,
                  f,
                  y,
                  c,
                  r,
                  o,
                  t,
                  e.isPermission(),
                );
              });
          else {
            y.create = !0;
            var n = {};
            (n.type = e.getPolicyType()),
              (n.config = {}),
              (n.logic = 'POSITIVE'),
              (n.decisionStrategy = 'UNANIMOUS'),
              (y.changed =
                y.historyBackOnSaveOrCancel || p.isBackNewAssociatedPolicy()),
              null != d.state &&
                null != d.state.previousUrl &&
                ((y.previousUrl = d.state.previousUrl),
                (a.state.rootUrl = y.previousUrl),
                (d.state = {})),
              (y.policy = angular.copy(n)),
              y.$watch(
                'policy',
                () => {
                  angular.equals(y.policy, n) || (y.changed = !0);
                },
                !0,
              ),
              p.isBackNewAssociatedPolicy()
                ? (e.onRestoreState?.(y.policy), this.restoreState(y))
                : e.onInitCreate?.(n),
              (y.save = () => {
                this.checkNameAvailability(() => {
                  e.onCreate?.(),
                    h.save(
                      { realm: m.realm, client: f.id, type: y.policy.type },
                      y.policy,
                      (t) => {
                        e.isPermission()
                          ? (y.historyBackOnSaveOrCancel ||
                            null != a.state.rootUrl
                              ? null != a.state.rootUrl
                                ? r.url(a.state.rootUrl)
                                : ((a.state.newPolicyName = y.policy.name),
                                  r.url(a.state.previousUrl))
                              : r.url(
                                  `/realms/${m.realm}/clients/${f.id}/authz/resource-server/permission/${y.policy.type}/${t.id}`,
                                ),
                            o.success('The permission has been created.'))
                          : (y.historyBackOnSaveOrCancel
                              ? ((a.state.newPolicyName = y.policy.name),
                                r.url(a.state.previousUrl))
                              : r.url(
                                  `/realms/${m.realm}/clients/${f.id}/authz/resource-server/policy/${y.policy.type}/${t.id}`,
                                ),
                            o.success('The policy has been created.'));
                      },
                    );
                });
              }),
              (y.reset = () => {
                e.isPermission()
                  ? y.historyBackOnSaveOrCancel || null != a.state.rootUrl
                    ? null != a.state.rootUrl
                      ? r.url(a.state.rootUrl)
                      : r.url(a.state.previousUrl)
                    : r.url(
                        `/realms/${m.realm}/clients/${f.id}/authz/resource-server/permission/`,
                      )
                  : y.historyBackOnSaveOrCancel
                    ? r.url(a.state.previousUrl)
                    : r.url(
                        `/realms/${m.realm}/clients/${f.id}/authz/resource-server/policy/`,
                      );
              });
          }
        }),
          (y.checkNewNameAvailability = () => {
            this.checkNameAvailability(() => {});
          }),
          (this.checkNameAvailability = (e) => {
            y.policy.name &&
              0 !== y.policy.name.trim().length &&
              l.search(
                {
                  realm: t.current.params.realm,
                  client: f.id,
                  name: y.policy.name,
                },
                (t) => {
                  t?.id && t.id !== y.policy.id
                    ? o.error(
                        'Name already in use by another policy or permission, please choose another one.',
                      )
                    : e();
                },
              );
          }),
          (this.restoreState = (e) => {
            (e.policy.name = a.state.policy.name),
              (e.policy.description = a.state.policy.description),
              (e.policy.decisionStrategy = a.state.policy.decisionStrategy),
              (e.policy.logic = a.state.policy.logic),
              (e.selectedPolicies = a.state.selectedPolicies),
              e.selectedPolicies || (e.selectedPolicies = []),
              (e.changed = !0);
            var t = a.state.previousPage;
            if (a.state.newPolicyName)
              l.query(
                {
                  realm: m.realm,
                  client: f.id,
                  permission: !1,
                  name: a.state.newPolicyName,
                  max: 20,
                  first: 0,
                },
                (r) => {
                  for (i = 0; i < r.length; i++)
                    r[i].name === a.state.newPolicyName &&
                      ((r[i].text = r[i].name), e.selectedPolicies.push(r[i]));
                  var n = a.state.rootUrl;
                  (a.state = {}),
                    (a.state.previousPage = t),
                    (a.state.rootUrl = n);
                },
              );
            else {
              var r = a.state.rootUrl;
              (a.state = {}), (a.state.previousPage = t), (a.state.rootUrl = r);
            }
          });
      },
    };
    return p;
  }),
  module.controller(
    'PolicyEvaluateCtrl',
    (e, t, r, _n, l, s, c, o, a, u, d, p, m) => {
      (e.realm = l),
        (e.client = a),
        (e.clients = s),
        (e.roles = c),
        (e.authzRequest = {}),
        (e.authzRequest.resources = []),
        (e.authzRequest.context = {}),
        (e.authzRequest.context.attributes = {}),
        (e.authzRequest.roleIds = []),
        (e.resultUrl = `${resourceUrl}/partials/authz/policy/resource-server-policy-evaluate-result.html`),
        (e.addContextAttribute = () => {
          e.newContextAttribute.value && '' !== e.newContextAttribute.value
            ? ((e.authzRequest.context.attributes[e.newContextAttribute.key] =
                e.newContextAttribute.value),
              delete e.newContextAttribute)
            : m.error('You must provide a value to a context attribute.');
        }),
        (e.removeContextAttribute = (t) => {
          delete e.authzRequest.context.attributes[t];
        }),
        (e.getContextAttribute = (t) => {
          for (i = 0; i < e.defaultContextAttributes.length; i++)
            if (e.defaultContextAttributes[i].key === t)
              return e.defaultContextAttributes[i];
          return e.authzRequest.context.attributes[t];
        }),
        (e.getContextAttributeName = (t) => {
          var r = e.getContextAttribute(t);
          return r.name ? r.name : t;
        }),
        (e.defaultContextAttributes = [
          { key: 'custom', name: 'Custom Attribute...', custom: !0 },
          {
            key: 'kc.identity.authc.method',
            name: 'Authentication Method',
            values: [
              { key: 'pwd', name: 'Password' },
              { key: 'otp', name: 'One-Time Password' },
              { key: 'kbr', name: 'Kerberos' },
            ],
          },
          { key: 'kc.realm.name', name: 'Realm' },
          { key: 'kc.time.date_time', name: 'Date/Time (MM/dd/yyyy hh:mm:ss)' },
          { key: 'kc.client.network.ip_address', name: 'Client IPv4 Address' },
          { key: 'kc.client.network.host', name: 'Client Host' },
          { key: 'kc.client.user_agent', name: 'Client/User Agent' },
        ]),
        (e.isDefaultContextAttribute = () =>
          !e.newContextAttribute ||
          (!e.newContextAttribute.custom &&
            !e.getContextAttribute(e.newContextAttribute.key).custom)),
        (e.selectDefaultContextAttribute = () => {
          e.newContextAttribute = angular.copy(e.newContextAttribute);
        }),
        (e.setApplyToResourceType = () => {
          delete e.newResource, (e.authzRequest.resources = []);
        }),
        (e.addResource = () => {
          var t = angular.copy(e.newResource);
          t || (t = {}),
            delete t.text,
            (!e.newScopes ||
              (null != t._id && e.newScopes.length > 0 && e.newScopes[0].id)) &&
              (e.newScopes = []);
          var r = [];
          for (i = 0; i < e.newScopes.length; i++)
            e.newScopes[i].name
              ? r.push(e.newScopes[i].name)
              : r.push(e.newScopes[i]);
          (t.scopes = r),
            e.authzRequest.resources.push(t),
            delete e.newResource,
            delete e.newScopes;
        }),
        (e.removeResource = (t) => {
          e.authzRequest.resources.splice(t, 1);
        }),
        (e.resolveScopes = () => {
          e.newResource._id &&
            ((e.newResource.scopes = []),
            (e.scopes = []),
            u.scopes(
              {
                realm: r.current.params.realm,
                client: a.id,
                rsrid: e.newResource._id,
              },
              (t) => {
                e.scopes = t;
              },
            ));
        }),
        (e.reevaluate = () => {
          e.authzRequest.entitlements ? e.entitlements() : e.save();
        }),
        (e.showAuthzData = () => {
          e.showRpt = !0;
        }),
        (e.save = () => {
          if (((e.authzRequest.entitlements = !1), e.applyResourceType)) {
            e.newResource || (e.newResource = {}),
              (!e.newScopes ||
                (null != e.newResource._id &&
                  e.newScopes.length > 0 &&
                  e.newScopes[0].id)) &&
                (e.newScopes = []);
            var n = angular.copy(e.newScopes);
            for (i = 0; i < n.length; i++) delete n[i].text;
            e.authzRequest.resources[0].scopes = n;
          }
          t.post(
            `${authUrl}/admin/realms/${r.current.params.realm}/clients/${a.id}/authz/resource-server/policy/evaluate`,
            e.authzRequest,
          ).then((t) => {
            (e.evaluationResult = t.data), e.showResultTab();
          });
        }),
        (e.entitlements = () => {
          (e.authzRequest.entitlements = !0),
            t
              .post(
                `${authUrl}/admin/realms/${r.current.params.realm}/clients/${a.id}/authz/resource-server/policy/evaluate`,
                e.authzRequest,
              )
              .then((t) => {
                (e.evaluationResult = t.data), e.showResultTab();
              });
        }),
        (e.showResultTab = () => {
          (e.showResult = !0), (e.showRpt = !1);
        }),
        (e.showRequestTab = () => {
          (e.showResult = !1), (e.showRpt = !1);
        }),
        (e.usersUiSelect = {
          minimumInputLength: 1,
          delay: 500,
          allowClear: !0,
          query: (e) => {
            var t = { results: [] };
            '' !== e.term.trim()
              ? p.query(
                  {
                    realm: r.current.params.realm,
                    search: e.term.trim(),
                    max: 20,
                  },
                  (r) => {
                    (t.results = r), e.callback(t);
                  },
                )
              : e.callback(t);
          },
          formatResult: (e, _t, _r) => ((e.text = e.username), e.username),
        }),
        (e.resourcesUiSelect = {
          minimumInputLength: 1,
          delay: 500,
          allowClear: !0,
          id: (e) => e._id,
          query: (t) => {
            var r = { results: [] };
            '' !== t.term.trim()
              ? ((e.query = {
                  realm: l.realm,
                  client: a.id,
                  name: t.term.trim(),
                  deep: !1,
                  max: 20,
                  first: 0,
                }),
                u.query(e.query, (e) => {
                  (r.results = e), t.callback(r);
                }))
              : t.callback(r);
          },
          formatResult: (e, _t, _r) => ((e.text = e.name), e.name),
        }),
        (e.scopesUiSelect = {
          minimumInputLength: 1,
          delay: 500,
          allowClear: !0,
          query: (t) => {
            var r = { results: [] };
            '' !== t.term.trim()
              ? ((e.query = {
                  realm: l.realm,
                  client: a.id,
                  name: t.term.trim(),
                  deep: !1,
                  max: 20,
                  first: 0,
                }),
                d.query(e.query, (e) => {
                  (r.results = e), t.callback(r);
                }))
              : t.callback(r);
          },
          formatResult: (e, _t, _r) => ((e.text = e.name), e.name),
        }),
        o.get({ realm: r.current.params.realm, client: a.id }, (t) => {
          e.server = t;
        }),
        (e.selectUser = (t) => {
          if (!t?.id)
            return (e.selectedUser = null), void (e.authzRequest.userId = '');
          e.authzRequest.userId = t.id;
        }),
        (e.reset = () => {
          (e.authzRequest = angular.copy(authzRequest)), (e.changed = !1);
        });
    },
  ),
  (getManageClientId = (e) =>
    e.realm === masterRealm ? 'master-realm' : 'realm-management'),
  module.controller(
    'RealmRolePermissionsCtrl',
    (e, _t, _r, i, n, l, s, c, o, a, u) => {
      console.log('RealmRolePermissionsCtrl'),
        (e.role = l),
        (e.realm = n),
        (e.remove = () => {
          u.remove(e.role, n, a, i, o);
        }),
        s.get({ realm: n.realm, role: l.id }, (t) => {
          (e.permissions = t),
            e.$watch(
              'permissions.enabled',
              (t, r) => {
                if (t !== r) {
                  var i = { enabled: e.permissions.enabled };
                  e.permissions = s.update({ realm: n.realm, role: l.id }, i);
                }
              },
              !0,
            );
        }),
        c.query({ realm: n.realm, clientId: getManageClientId(n) }, (t) => {
          e.realmManagementClientId = t[0].id;
        });
    },
  ),
  module.controller(
    'ClientRolePermissionsCtrl',
    (e, _t, _r, _i, n, l, s, _c, o, c, _a) => {
      console.log('RealmRolePermissionsCtrl'),
        (e.client = l),
        (e.role = s),
        (e.realm = n),
        o.get({ realm: n.realm, role: s.id }, (t) => {
          (e.permissions = t),
            e.$watch(
              'permissions.enabled',
              (t, r) => {
                if (t !== r) {
                  var i = { enabled: e.permissions.enabled };
                  e.permissions = o.update({ realm: n.realm, role: s.id }, i);
                }
              },
              !0,
            );
        }),
        c.query({ realm: n.realm, clientId: getManageClientId(n) }, (t) => {
          e.realmManagementClientId = t[0].id;
        });
    },
  ),
  module.controller('UsersPermissionsCtrl', (e, _t, _r, _i, n, l, s, _c) => {
    console.log('UsersPermissionsCtrl'), (e.realm = n);
    l.get({ realm: n.realm }, (t) => {
      (e.permissions = t),
        e.$watch(
          'permissions.enabled',
          (t, r) => {
            if (t !== r) {
              var i = { enabled: e.permissions.enabled };
              e.permissions = l.update({ realm: n.realm }, i);
            }
          },
          !0,
        );
    }),
      s.query({ realm: n.realm, clientId: getManageClientId(n) }, (t) => {
        e.realmManagementClientId = t[0].id;
      });
  }),
  module.controller(
    'ClientPermissionsCtrl',
    (e, _t, _r, _i, n, l, s, c, _o) => {
      (e.client = l),
        (e.realm = n),
        c.get({ realm: n.realm, client: l.id }, (t) => {
          (e.permissions = t),
            e.$watch(
              'permissions.enabled',
              (t, r) => {
                if (t !== r) {
                  var i = { enabled: e.permissions.enabled };
                  e.permissions = c.update({ realm: n.realm, client: l.id }, i);
                }
              },
              !0,
            );
        }),
        s.query({ realm: n.realm, clientId: getManageClientId(n) }, (t) => {
          e.realmManagementClientId = t[0].id;
        });
    },
  ),
  module.controller(
    'IdentityProviderPermissionCtrl',
    (e, _t, _r, _i, n, l, s, c, _o) => {
      (e.identityProvider = l),
        (e.realm = n),
        c.get({ realm: n.realm, alias: l.alias }, (t) => {
          (e.permissions = t),
            e.$watch(
              'permissions.enabled',
              (t, r) => {
                if (t !== r) {
                  var i = { enabled: e.permissions.enabled };
                  e.permissions = c.update(
                    { realm: n.realm, alias: l.alias },
                    i,
                  );
                }
              },
              !0,
            );
        }),
        s.query({ realm: n.realm, clientId: getManageClientId(n) }, (t) => {
          e.realmManagementClientId = t[0].id;
        });
    },
  ),
  module.controller('GroupPermissionsCtrl', (e, _t, _r, _i, n, l, s, c, _o) => {
    (e.group = l),
      (e.realm = n),
      c.query({ realm: n.realm, clientId: getManageClientId(n) }, (t) => {
        e.realmManagementClientId = t[0].id;
      }),
      s.get({ realm: n.realm, group: l.id }, (t) => {
        (e.permissions = t),
          e.$watch(
            'permissions.enabled',
            (t, r) => {
              if (t !== r) {
                var i = { enabled: e.permissions.enabled };
                e.permissions = s.update({ realm: n.realm, group: l.id }, i);
              }
            },
            !0,
          );
      });
  });
