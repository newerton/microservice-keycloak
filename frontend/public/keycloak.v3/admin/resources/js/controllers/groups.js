module.controller('GroupListCtrl', (e, r, t, l, n, a, o, s, i, u, c, d, p) => {
  (e.realm = l),
    (e.groupList = [{ id: 'realm', name: p.instant('groups'), subGroups: [] }]),
    (e.searchCriteria = ''),
    (e.currentPage = 1),
    (e.currentPageInput = e.currentPage),
    (e.pageSize = 20),
    (e.numberOfPages = 1),
    (e.tree = []);
  var m = (r) => {
    console.log('refreshGroups'), (e.currentPageInput = e.currentPage);
    var o = e.currentPage * e.pageSize - e.pageSize;
    console.log(`first:${o}`);
    var s = { realm: l.realm, first: o, max: e.pageSize },
      u = { realm: l.realm, top: 'true' };
    angular.isDefined(r) && '' !== r && ((s.search = r), (u.search = r));
    var c = t.defer();
    n.query(
      s,
      (e) => {
        c.resolve(e);
      },
      () => {
        c.reject(p.instant('group.fetch.fail', { params: s }));
      },
    ),
      c.promise.then(
        (t) => {
          (e.groupList = [
            {
              id: 'realm',
              name: p.instant('groups'),
              subGroups: d.sortGroups('name', t),
            },
          ]),
            angular.isDefined(r) &&
              '' !== r &&
              setTimeout(() => {
                document.querySelectorAll('span').forEach((e) => {
                  -1 !== e.textContent.indexOf(r) &&
                    angular.element(e).addClass('highlight');
                });
              }, 500);
        },
        (e) => {
          i.error(e);
        },
      );
    var m = t.defer();
    console.log(`countParams: realm[${u.realm}`),
      a.query(
        u,
        (e) => {
          m.resolve(e);
        },
        () => {
          m.reject(p.instant('group.fetch.fail', { params: u }));
        },
      ),
      m.promise.then(
        (r) => {
          angular.isDefined(r.count) && r.count > e.pageSize
            ? (e.numberOfPages = Math.ceil(r.count / e.pageSize))
            : (e.numberOfPages = 1);
        },
        (e) => {
          i.error(e);
        },
      );
  };
  m(),
    e.$watch('currentPage', (r, t) => {
      parseInt(r, 10) !== t && m(e.searchCriteria);
    }),
    (e.clearSearch = () => {
      (e.searchCriteria = ''),
        1 === parseInt(e.currentPage, 10) ? m() : (e.currentPage = 1);
    }),
    (e.searchGroup = () => {
      1 === parseInt(e.currentPage, 10)
        ? m(e.searchCriteria)
        : (e.currentPage = 1);
    }),
    (e.edit = (e) => {
      'realm' !== e.id && u.url(`/realms/${l.realm}/groups/${e.id}`);
    }),
    (e.cut = (r) => {
      e.cutNode = r;
    }),
    (e.isDisabled = () =>
      !e.tree.currentNode || 'realm' === e.tree.currentNode.id),
    (e.paste = (t) => {
      null !== t &&
        null !== e.cutNode &&
        t.id !== e.cutNode.id &&
        ('realm' === t.id
          ? n.save({ realm: l.realm }, { id: e.cutNode.id }, () => {
              r.reload(), i.success(p.instant('group.move.success'));
            })
          : s.save(
              { realm: l.realm, groupId: t.id },
              { id: e.cutNode.id },
              () => {
                r.reload(), i.success(p.instant('group.move.success'));
              },
            ));
    }),
    (e.remove = (e) => {
      null !== e &&
        c.confirmWithButtonText(
          p.instant('group.remove.confirm.title', { name: e.name }),
          p.instant('group.remove.confirm.message', { name: e.name }),
          p.instant('dialogs.delete.confirm'),
          () => {
            o.remove({ realm: l.realm, groupId: e.id }, () => {
              r.reload(), i.success(p.instant('group.remove.success'));
            });
          },
        );
    }),
    (e.createGroup = (e) => {
      var r = 'realm';
      e && (r = e.id), u.url(`/create/group/${l.realm}/parent/${r}`);
    });
  (e.getGroupClass = (e) =>
    'realm' === e.id
      ? 'pficon pficon-users'
      : ((e) => 'realm' !== e.id && (!e.subGroups || 0 === e.subGroups.length))(
            e,
          )
        ? 'normal'
        : e.subGroups.length && e.collapsed
          ? 'collapsed'
          : e.subGroups.length && !e.collapsed
            ? 'expanded'
            : 'collapsed'),
    (e.getSelectedClass = (r) =>
      r.selected
        ? 'selected'
        : e.cutNode && e.cutNode.id === r.id
          ? 'cut'
          : void 0);
}),
  module.controller('GroupCreateCtrl', (e, _r, t, l, n, _a, o, s, i, u) => {
    (e.realm = t),
      (e.group = {}),
      (e.save = () => {
        console.log('save!!!'),
          'realm' === l
            ? (console.log('realm'),
              n.save({ realm: t.realm }, e.group, (_e, r) => {
                var l = r().location,
                  n = l.substring(l.lastIndexOf('/') + 1);
                i.url(`/realms/${t.realm}/groups/${n}`),
                  s.success(u.instant('group.create.success'));
              }))
            : o.save({ realm: t.realm, groupId: l }, e.group, (_e, r) => {
                var l = r().location,
                  n = l.substring(l.lastIndexOf('/') + 1);
                i.url(`/realms/${t.realm}/groups/${n}`),
                  s.success(u.instant('group.create.success'));
              });
      }),
      (e.cancel = () => {
        i.url(`/realms/${t.realm}/groups`);
      });
  }),
  module.controller('GroupTabCtrl', (e, r, t, l, n, a, o) => {
    r.removeGroup = () => {
      e.confirmWithButtonText(
        o.instant('group.remove.confirm.title', { name: r.group.name }),
        o.instant('group.remove.confirm.message', { name: r.group.name }),
        o.instant('dialogs.delete.confirm'),
        () => {
          l.remove({ realm: t.realm.realm, groupId: r.group.id }, () => {
            a.url(`/realms/${t.realm.realm}/groups`),
              n.success(o.instant('group.remove.success'));
          });
        },
      );
    };
  }),
  module.controller('GroupDetailCtrl', (_e, r, t, l, n, a, o, s) => {
    function i(e) {
      var r = e.attributes;
      for (var t in r) 'object' === typeof r[t] && (r[t] = r[t].join('##'));
    }
    (r.realm = t),
      l.attributes || (l.attributes = {}),
      i(l),
      (r.group = angular.copy(l)),
      (r.changed = !1),
      r.$watch(
        'group',
        () => {
          angular.equals(r.group, l) || (r.changed = !0);
        },
        !0,
      ),
      (r.save = () => {
        !(() => {
          var e = r.group.attributes;
          for (var t in e)
            'string' === typeof e[t] && (e[t] = e[t].split('##'));
        })(),
          n.update({ realm: t.realm, groupId: r.group.id }, r.group, () => {
            (r.changed = !1),
              i(r.group),
              (l = angular.copy(r.group)),
              a.success(s.instant('group.edit.success'));
          });
      }),
      (r.reset = () => {
        (r.group = angular.copy(l)), (r.changed = !1);
      }),
      (r.cancel = () => {
        o.url(`/realms/${t.realm}/groups`);
      }),
      (r.addAttribute = () => {
        (r.group.attributes[r.newAttribute.key] = r.newAttribute.value),
          delete r.newAttribute;
      }),
      (r.removeAttribute = (e) => {
        delete r.group.attributes[e];
      });
  }),
  module.controller(
    'GroupRoleMappingCtrl',
    (e, r, t, l, n, a, o, s, i, u, c, d, p, m, g, f) => {
      (e.realm = l),
        (e.group = n),
        (e.selectedRealmRoles = []),
        (e.selectedRealmMappings = []),
        (e.realmMappings = []),
        (e.clients = a),
        (e.client = o),
        (e.clientRoles = []),
        (e.clientComposite = []),
        (e.selectedClientRoles = []),
        (e.selectedClientMappings = []),
        (e.clientMappings = []),
        (e.dummymodel = []),
        (e.realmMappings = u.query({ realm: l.realm, groupId: n.id })),
        (e.realmRoles = d.query({ realm: l.realm, groupId: n.id })),
        (e.realmComposite = m.query({ realm: l.realm, groupId: n.id })),
        (e.addRealmRole = () => {
          (e.selectedRealmRolesToAdd = JSON.parse(`[${e.selectedRealmRoles}]`)),
            (e.selectedRealmRoles = []),
            r
              .post(
                `${authUrl}/admin/realms/${l.realm}/groups/${n.id}/role-mappings/realm`,
                e.selectedRealmRolesToAdd,
              )
              .then(() => {
                (e.realmMappings = u.query({ realm: l.realm, groupId: n.id })),
                  (e.realmRoles = d.query({ realm: l.realm, groupId: n.id })),
                  (e.realmComposite = m.query({
                    realm: l.realm,
                    groupId: n.id,
                  })),
                  (e.selectedRealmMappings = []),
                  (e.selectRealmRoles = []),
                  e.selectedClient &&
                    (console.log('load available'),
                    (e.clientComposite = g.query({
                      realm: l.realm,
                      groupId: n.id,
                      client: e.selectedClient.id,
                    })),
                    (e.clientRoles = p.query({
                      realm: l.realm,
                      groupId: n.id,
                      client: e.selectedClient.id,
                    })),
                    (e.clientMappings = c.query({
                      realm: l.realm,
                      groupId: n.id,
                      client: e.selectedClient.id,
                    })),
                    (e.selectedClientRoles = []),
                    (e.selectedClientMappings = [])),
                  (e.selectedRealmRolesToAdd = []),
                  i.success(f.instant('group.roles.add.success'));
              });
        }),
        (e.deleteRealmRole = () => {
          (e.selectedRealmMappingsToRemove = JSON.parse(
            `[${e.selectedRealmMappings}]`,
          )),
            r
              .delete(
                `${authUrl}/admin/realms/${l.realm}/groups/${n.id}/role-mappings/realm`,
                {
                  data: e.selectedRealmMappingsToRemove,
                  headers: { 'content-type': 'application/json' },
                },
              )
              .then(() => {
                (e.realmMappings = u.query({ realm: l.realm, groupId: n.id })),
                  (e.realmRoles = d.query({ realm: l.realm, groupId: n.id })),
                  (e.realmComposite = m.query({
                    realm: l.realm,
                    groupId: n.id,
                  })),
                  (e.selectedRealmMappings = []),
                  (e.selectRealmRoles = []),
                  e.selectedClient &&
                    (console.log('load available'),
                    (e.clientComposite = g.query({
                      realm: l.realm,
                      groupId: n.id,
                      client: e.selectedClient.id,
                    })),
                    (e.clientRoles = p.query({
                      realm: l.realm,
                      groupId: n.id,
                      client: e.selectedClient.id,
                    })),
                    (e.clientMappings = c.query({
                      realm: l.realm,
                      groupId: n.id,
                      client: e.selectedClient.id,
                    })),
                    (e.selectedClientRoles = []),
                    (e.selectedClientMappings = [])),
                  (e.selectedRealmMappingsToRemove = []),
                  i.success(f.instant('group.roles.remove.success'));
              });
        }),
        (e.addClientRole = () => {
          (e.selectedClientRolesToAdd = JSON.parse(
            `[${e.selectedClientRoles}]`,
          )),
            r
              .post(
                `${authUrl}/admin/realms/${l.realm}/groups/${n.id}/role-mappings/clients/${e.selectedClient.id}`,
                e.selectedClientRolesToAdd,
              )
              .then(() => {
                (e.clientMappings = c.query({
                  realm: l.realm,
                  groupId: n.id,
                  client: e.selectedClient.id,
                })),
                  (e.clientRoles = p.query({
                    realm: l.realm,
                    groupId: n.id,
                    client: e.selectedClient.id,
                  })),
                  (e.clientComposite = g.query({
                    realm: l.realm,
                    groupId: n.id,
                    client: e.selectedClient.id,
                  })),
                  (e.selectedClientRoles = []),
                  (e.selectedClientMappings = []),
                  (e.realmComposite = m.query({
                    realm: l.realm,
                    groupId: n.id,
                  })),
                  (e.realmRoles = d.query({ realm: l.realm, groupId: n.id })),
                  (e.selectedClientRolesToAdd = []),
                  i.success(f.instant('group.roles.add.success'));
              });
        }),
        (e.deleteClientRole = () => {
          (e.selectedClientMappingsToRemove = JSON.parse(
            `[${e.selectedClientMappings}]`,
          )),
            r
              .delete(
                `${authUrl}/admin/realms/${l.realm}/groups/${n.id}/role-mappings/clients/${e.selectedClient.id}`,
                {
                  data: e.selectedClientMappingsToRemove,
                  headers: { 'content-type': 'application/json' },
                },
              )
              .then(() => {
                (e.clientMappings = c.query({
                  realm: l.realm,
                  groupId: n.id,
                  client: e.selectedClient.id,
                })),
                  (e.clientRoles = p.query({
                    realm: l.realm,
                    groupId: n.id,
                    client: e.selectedClient.id,
                  })),
                  (e.clientComposite = g.query({
                    realm: l.realm,
                    groupId: n.id,
                    client: e.selectedClient.id,
                  })),
                  (e.selectedClientRoles = []),
                  (e.selectedClientMappings = []),
                  (e.realmComposite = m.query({
                    realm: l.realm,
                    groupId: n.id,
                  })),
                  (e.realmRoles = d.query({ realm: l.realm, groupId: n.id })),
                  (e.selectedClientMappingsToRemove = []),
                  i.success(f.instant('group.roles.remove.success'));
              });
        }),
        (e.changeClient = (r) => {
          if (((e.selectedClient = r), !r?.id))
            return (
              (e.selectedClient = null),
              (e.clientRoles = null),
              (e.clientMappings = null),
              void (e.clientComposite = null)
            );
          e.selectedClient &&
            ((e.clientComposite = g.query({
              realm: l.realm,
              groupId: n.id,
              client: e.selectedClient.id,
            })),
            (e.clientRoles = p.query({
              realm: l.realm,
              groupId: n.id,
              client: e.selectedClient.id,
            })),
            (e.clientMappings = c.query({
              realm: l.realm,
              groupId: n.id,
              client: e.selectedClient.id,
            }))),
            (e.selectedClientRoles = []),
            (e.selectedClientMappings = []);
        }),
        clientSelectControl(e, t.current.params.realm, s);
    },
  ),
  module.controller('GroupMembersCtrl', (e, r, t, l) => {
    (e.realm = r),
      (e.page = 0),
      (e.group = t),
      (e.query = { realm: r.realm, groupId: t.id, max: 5, first: 0 }),
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
          (e.users = l.query(e.query, () => {
            console.log('search loaded'),
              (e.searchLoaded = !0),
              (e.lastSearch = e.query.search);
          }));
      }),
      e.searchQuery();
  }),
  module.controller('DefaultGroupsCtrl', (e, r, t, l, n, a, o, s) => {
    (e.realm = t),
      (e.groupList = []),
      (e.selectedGroup = null),
      (e.tree = []),
      (e.searchCriteria = ''),
      (e.currentPage = 1),
      (e.currentPageInput = e.currentPage),
      (e.pageSize = 20),
      (e.numberOfPages = 1);
    var i = () => {
        a.query({ realm: t.realm }, (r) => {
          e.defaultGroups = r;
        });
      },
      u = (a) => {
        var i = e.currentPage * e.pageSize - e.pageSize;
        e.currentPageInput = e.currentPage;
        var u = { realm: t.realm, first: i, max: e.pageSize },
          c = { realm: t.realm, top: 'true' };
        angular.isDefined(a) && '' !== a && ((u.search = a), (c.search = a));
        var d = r.defer();
        l.query(
          u,
          (e) => {
            d.resolve(e);
          },
          () => {
            d.reject(s.instant('group.fetch.fail', { params: u }));
          },
        ),
          d.promise.then(
            (r) => {
              e.groupList = r;
            },
            (e) => {
              o.success(e);
            },
          );
        var p = r.defer();
        n.query(
          c,
          (e) => {
            p.resolve(e);
          },
          () => {
            p.reject(s.instant('group.fetch.fail', { params: c }));
          },
        ),
          p.promise.then(
            (r) => {
              angular.isDefined(r.count) &&
                r.count > e.pageSize &&
                (e.numberOfPages = Math.ceil(r.count / e.pageSize));
            },
            (e) => {
              o.success(e);
            },
          );
      };
    u(),
      e.$watch('currentPage', (r, t) => {
        parseInt(r, 10) !== parseInt(t, 10) && u(e.searchCriteria);
      }),
      (e.clearSearch = () => {
        (e.searchCriteria = ''),
          1 === parseInt(e.currentPage, 10) ? u() : (e.currentPage = 1);
      }),
      (e.searchGroup = () => {
        1 === parseInt(e.currentPage, 10)
          ? u(e.searchCriteria)
          : (e.currentPage = 1);
      }),
      i(),
      (e.addDefaultGroup = () => {
        e.tree.currentNode
          ? a.update({ realm: t.realm, groupId: e.tree.currentNode.id }, () => {
              i(), o.success(s.instant('group.default.add.success'));
            })
          : o.error(s.instant('group.default.add.error'));
      }),
      (e.removeDefaultGroup = () => {
        a.remove({ realm: t.realm, groupId: e.selectedGroup.id }, () => {
          i(), o.success(s.instant('group.default.remove.success'));
        });
      });
    (e.getGroupClass = (e) =>
      'realm' === e.id
        ? 'pficon pficon-users'
        : ((e) =>
              'realm' !== e.id && (!e.subGroups || 0 === e.subGroups.length))(e)
          ? 'normal'
          : e.subGroups.length && e.collapsed
            ? 'collapsed'
            : e.subGroups.length && !e.collapsed
              ? 'expanded'
              : 'collapsed'),
      (e.getSelectedClass = (r) =>
        r.selected
          ? 'selected'
          : e.cutNode && e.cutNode.id === r.id
            ? 'cut'
            : void 0);
  });
