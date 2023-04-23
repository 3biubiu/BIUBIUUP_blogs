import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar';
export default {
    vite: {
        plugins: [
            // add plugin
            AutoSidebar()
        ]
    },
    title: 'BIUBIUUP Blogs',
    description: '',
    themeConfig: {
        siteTitle: "BIUBIUUP Blogs",
        logo: "/logo.png",
        nav: [
            { text: "主页", link: "/" },
            { text: "前端", link: "/web/" },
        ],
       
        socialLinks: [
            { icon: "github", link: "https://github.com/3biubiu" },
        ],
    },
};

//   git remote add origin xx
// git branch -M master
// git push -u origin master
