export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './Login/Login' },
      { path: '/user/register', component: './Login/Register' },
      { path: '/user/register-result', component: './Login/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    redirect: '/user',
  },
  // 欢迎页
  {
    path: '/welcome',
    component: '../layouts/BasicLayout',
    routes: [
      {path: '/welcome', component: './Welcome'}
    ]
  },
    // 订单管理
    {
      path: '/order',
      component: '../layouts/BasicLayout',
      routes: [
        { path: '/order', redirect: '/order/list' },
        { path: '/order/list', component: './Order/OrderList' },
        { path: '/order/refund/:orderSn', component: './Order/Refund' },
        { path: '/order/review-refund/:orderSn', component: './Order/ReviewRefund' },
      ]
    },
    // 交接班
    {
      path: '/classes',
      component: '../layouts/BasicLayout',
      routes: [
        { path: '/classes', redirect: '/classes/list' },
        { path: '/classes/list', component: './Classes/ClassesList' },
        { path: '/classes/list/historyClasses', component: './Classes/HistoryClasses' },
        { path: '/classes/list/historyClasses/desc/:id', component: './Classes/HistoryClassesDesc' },
      ]
    },
    {
      path: '/exception',
      component: '../layouts/BasicLayout',
      routes: [
        // exception
        { path: '/exception/403', component: './Exception/403' },
        { path: '/exception/404', component: './Exception/404' },
        { path: '/exception/500', component: './Exception/500' },
        { path: '/exception/trigger', component: './Exception/TriggerException' },
      ],
    },
    {
      path: '/system',
      component: '../layouts/BasicLayout',
      routes: [
        {
          path: '/system/dept',
          routes: [
            { path: '/system/dept', redirect: '/system/dept/list' },
            { path: '/system/dept/list', component: './System/Dept/Dept' },
            { path: '/system/dept/company/add', component: './System/Dept/DeptComAdd' },
            { path: '/system/dept/station/add/:tenantId', component: './System/Dept/DeptStationAdd' },
            { path: '/system/dept/edit/:id', component: './System/Dept/DeptEdit' },
            { path: '/system/dept/stationEdit/:nodeId', component: './System/Dept/DeptStationEdit' },
          ],
        },
        {
          path: '/system/oilPrice',
          routes: [
            { path: '/system/oilPrice', redirect: '/system/oilPrice/list' },
            { path: '/system/oilPrice/list', component: './System/OilPrice/OilPrice' },
            { path: '/system/oilPrice/add/:stationId', component: './System/OilPrice/OilPriceAdd' },
            { path: '/system/oilPrice/detail/:stationId', component: './System/OilPrice/OilPriceDetail' },
            { path: '/system/oilPrice/edit/:stationId', component: './System/OilPrice/OilPriceEdit' },
            { path: '/system/oilPrice/OilPriceHistory/:stationId', component: './System/OilPrice/OilPriceHistory' },
          ],
        },
        {
          path: '/system/role',
          routes: [
            { path: '/system/role', redirect: '/system/role/list' },
            { path: '/system/role/list', component: './System/Role/Role' },
            { path: '/system/role/add', component: './System/Role/RoleAdd' },
            { path: '/system/role/add/:id', component: './System/Role/RoleAdd' },
            { path: '/system/role/edit/:id', component: './System/Role/RoleEdit' },
            { path: '/system/role/view/:id', component: './System/Role/RoleView' },
          ],
        },
        {
          path: '/system/menu',
          routes: [
            { path: '/system/menu', redirect: '/system/menu/list' },
            { path: '/system/menu/list', component: './System/Menu/Menu' },
            { path: '/system/menu/add', component: './System/Menu/MenuAdd' },
            { path: '/system/menu/add/:id', component: './System/Menu/MenuAdd' },
            { path: '/system/menu/edit/:id', component: './System/Menu/MenuEdit' },
            { path: '/system/menu/view/:id', component: './System/Menu/MenuView' },
          ],
        },
        {
          path: '/system/user',
          routes: [
            { path: '/system/user', redirect: '/system/user/list' },
            { path: '/system/user/list', component: './System/User/User' },
            { path: '/system/user/add', component: './System/User/UserAdd' },
            { path: '/system/user/add/:id', component: './System/User/UserAdd' },
            { path: '/system/user/edit/:id', component: './System/User/UserEdit' },
            { path: '/system/user/view/:id', component: './System/User/UserView' },
          ],
        },
        {
          path: '/system/dict',
          routes: [
            { path: '/system/dict', redirect: '/system/dict/list' },
            { path: '/system/dict/list', component: './System/Dict/Dict' },
            { path: '/system/dict/add', component: './System/Dict/DictAdd' },
            { path: '/system/dict/add/:id', component: './System/Dict/DictAdd' },
            { path: '/system/dict/edit/:id', component: './System/Dict/DictEdit' },
            { path: '/system/dict/view/:id', component: './System/Dict/DictView' },
          ],
        },
      ],
    },
    {
      path: '/oilstation',
      component: '../layouts/BasicLayout',
      routes: [
        { path: '/oilstation', redirect: '/oilstation/list' },
        { path: '/oilstation/list', component: './OilStation/OilStationList' },
        { path: '/oilstation/view/:id', component: './OilStation/AddOilStation' },
        // {
        //   path: '/oilstation/addOil',
        //   routes: [
        //     { path: '/oilstation/addOil', redirect: '/oilstation/addOil/list' },
        //     { path: '/oilstation/addOil/list', component: './OilStation/AddOil/AddOilStation' },
        //     { path: '/oilstation/addOil/edit/:id', component: './oilstation/AddOil/StaEdit' },
        //   ]
        // },
        // {
        //   path: '/oilstation/oilList',
        //   routes: [
        //     { path: '/oilstation/oilList', redirect: '/oilstation/oilList/list' },
        //     { path: '/oilstation/oilList/list', component: './OilStation/OilList/OilStationList' },
        //     { path: '/oilstation/oilList/edit/:id', component: './oilstation/OilList/OilStaEdit' },
        //   ]
        // },
      ]
    },
    {
      path: '/antenna',
      component: '../layouts/BasicLayout',
      routes: [
        { path: '/antenna', redirect: '/antenna/list' },
        { path: '/antenna/list', component: './Antenna/AntennaList' },
        { path: '/antenna/edit/:id', component: './Antenna/AntennaEdit' },
      ]
    },
    {
      path: '*',
      component: '404',
    },
];
