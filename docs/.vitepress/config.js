import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar';

export default {
    vite: {
        plugins: [
            // add plugin
            AutoSidebar({ ignoreList: ["index.md"], ignoreIndexItem: true })
        ]
    },
    title: 'BIUBIUUP Blogs',
    description: '我与我周旋许久,宁做我',
    themeConfig: {
        siteTitle: "BIUBIUUP Blogs",
        logo: "/logo.png",
        nav: [
            { text: "主页", link: "/" },
            { text: "前端", link: "/web/" },
        ],
        // sidebar: {
        //     "/web/": [
        //         {
        //             text: "使用D3绘制地图",
        //             link: "/web/使用D3绘制地图以及一些坑",
        //         },
        //         {
        //             text: "在SVG中插入HTML标签",
        //             link: "/web/在SVG中插入HTML标签",
        //         },
        //     ],
        // },

        socialLinks: [
            { icon: "github", link: "https://github.com/3biubiu" },
        ],
    },
};

//   git remote add origin xx
// git branch -M master
// git push -u origin master
