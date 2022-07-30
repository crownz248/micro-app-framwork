module.exports = {
    "plugins": [
        ["./micro_app_babel_plugin.js"],
        
    ],
    presets: [
        [
            '@babel/preset-react',
            {
                pragma: 'createElement'
            }
        ]
    ]
}