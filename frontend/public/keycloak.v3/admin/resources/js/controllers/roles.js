module.controller('RoleMembersCtrl', (e, r, a, u, s, o, c, n) => {
  (e.realm = r),
    (e.page = 0),
    (e.role = a),
    (e.query = { realm: r.realm, role: a.name, max: 5, first: 0 }),
    (e.remove = () => {
      n.remove(e.role, r, s, c, o);
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
        (e.users = u.query(e.query, () => {
          console.log('search loaded'),
            (e.searchLoaded = !0),
            (e.lastSearch = e.query.search);
        }));
    }),
    e.searchQuery();
});
