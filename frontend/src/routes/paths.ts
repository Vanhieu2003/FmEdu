// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    one: `${ROOTS.DASHBOARD}/one`,
    two: `${ROOTS.DASHBOARD}/two`,
    detail: (id: string) => `${ROOTS.DASHBOARD}/two/detail/${id}`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
    roomgroup:{
      root: `${ROOTS.DASHBOARD}/room-group`,
      list: `${ROOTS.DASHBOARD}/room-group/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/room-group/${id}`,
      create: `${ROOTS.DASHBOARD}/room-group/create`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/room-group/${id}/edit`,
    } ,
    responsiblegroup:{
      root: `${ROOTS.DASHBOARD}/responsible-group`,
      list: `${ROOTS.DASHBOARD}/responsible-group/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/responsible-group/detail/${id}`,
      create: `${ROOTS.DASHBOARD}/responsible-group/create`,
      createUserPerTag: `${ROOTS.DASHBOARD}/responsible-group/createUserPerTag`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/responsible-group/${id}/edit`,
    } ,

    shift:{
      root: `${ROOTS.DASHBOARD}/shift`,
      list: `${ROOTS.DASHBOARD}/shift/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/shift/${id}/detail`,
      create: `${ROOTS.DASHBOARD}/shift/create`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/shift/${id}/edit`,
    } ,
  },
};
