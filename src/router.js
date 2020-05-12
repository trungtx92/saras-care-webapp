import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Admin from "./views/private/Admin.vue";
import Case from "./views/private/Case.vue";
import User from "./views/private/User.vue";

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [

        // PUBLIC AREA
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/login",
            name: "login",
            component: () =>
            import("./views/Login.vue")
        },
        {
            path: "/404",
            name: "404",
            component: () =>
            import("./views/404.vue")
        },

        // SUPER ADMIN AREA
        {
            path: "/admin",
            name: "admin-dash",
            component: () =>
            import("./views/private/Admin.vue")
        },
        {
            path: "/admin/inbox",
            name: "admin-inbox",
            component: () =>
            import("./views/private/Admin.vue")
        },
        {
            path: "/admin/cases",
            name: "admin-cases",
            component: () =>
            import("./views/private/Admin.vue")
        },
        {
            path: "/admin/case/:id",
            name: "admin-case-view",
            props: true,
            component: Case
        },
        {
            path: "/admin/case/edit/:id",
            name: "admin-case-edit",
            props: true,
            component: Case
        },
        {
            path: "/admin/users",
            name: "admin-users",
            component: () =>
            import("./views/private/Admin.vue")
        },
        {
            path: "/admin/users/add/",
            name: "admin-user-add",
            component: () =>
            import("./views/private/Admin.vue")
        },
        {
            path: "/admin/user/:id",
            name: "admin-user-view",
            props: true,
            component: User
        },
        {
            path: "/admin/user/edit/:id",
            name: "admin-user-edit",
            props: true,
            component: User
        },
        {
            path: "/admin/profile",
            name: "admin-profile",
            component: () =>
            import("./views/private/Profile.vue")
        },
        
        // CASE OFFICER AREA
        {
            path: "/caseofficer",
            name: "cofficer-dash",
            component: () =>
            import("./views/private/CaseOfficer.vue")
        },
        
        {
            path: "/caseofficer/case/:id",
            name: "cofficer-case-view",
            props: true,
            component: Case
        },
        {
            path: "/caseofficer/case/edit/:id",
            name: "cofficer-case-edit",
            props: true,
            component: Case
        },
        {
            path: "/caseofficer/user/:id",
            name: "cofficer-user-view",
            props: true,
            component: User
        },
        {
            path: "/caseofficer/user/edit/:id",
            name: "cofficer-user-edit",
            props: true,
            component: User
        },
        {
            path: "/caseofficer/profile",
            name: "cofficer-profile",
            component: () =>
            import("./views/private/Profile.vue")
        },

        // REGISTERED USER AREA
        {
            path: "/reguser",
            name: "reguser-dash",
            component: () =>
            import("./views/private/RegisteredUser.vue")
        },
        {
            path: "/reguser/profile",
            name: "reguser-profile",
            component: () =>
            import("./views/private/Profile.vue")
        },
        {
            path: "/reguser/user/:id",
            name: "reguser-user-view",
            props: true,
            component: User
        },
        {
            path: "/reguser/user/edit/:id",
            name: "reguser-user-edit",
            props: true,
            component: User
        },
        
    ]
});
