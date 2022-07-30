module.exports = {
    "plugins": [
        ["./babel_plugin.js"],
        
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