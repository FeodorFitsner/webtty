const WebpackModules = require("webpack-modules");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = (env, argv) => {
    const config = {
        mode: argv.mode,

        entry: "./index.tsx",

        devtool: argv.mode == "production" ? "source-map" : "inline-source-map",

        resolve: {
            extensions: [".ts", ".tsx", ".js"]
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [{ loader: "ts-loader" }]
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                }
            ]
        },

        plugins: [
            new WebpackModules(),
            new HtmlWebpackPlugin({
                ...(argv.mode == "production"
                    ? {
                          minify: {
                              removeComments: true,
                              collapseWhitespace: true
                          },
                          inlineSource: ".(js|css)$"
                      }
                    : {}),
                template: "index.html"
            }),
            new HtmlWebpackInlineSourcePlugin(),

            ...(argv.mode == "production"
                ? [new BundleAnalyzerPlugin({ analyzerMode: "static" })]
                : [])
        ],

        devServer: {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            port: 3000,
            proxy: {
                "/ws": "http://localhost:5000"
            }
        },
    };

    return config;
};
