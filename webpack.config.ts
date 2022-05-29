const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = function (env, argv) {
    var isDev = argv.mode === "development";
    var filename = (ext: string): string => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

    var plugins = () => {
        return [
            new HTMLWebpackPlugin({template: "./public/index.html"}),
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: filename("css")
            }),
            new CopyPlugin({
                patterns: [
                    { from: "public/assets", to: "assets" },
                ],
            }),
        ];
    };

    var cssLoaders = (addition?: string) => {
        var loaders = [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    hmr: isDev,
                    reloadAll: true,
                },
            },
            "css-loader",
        ];
        if (addition) {
            loaders.push(addition);
        }

        return loaders;
    };

    var config = {
        context: __dirname,
        mode: "development",
        entry: {
            main: ["./src/index.ts"]
        },
        output: {
            filename: filename("js"),
            path: __dirname + "/dist",
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".png", ".json"],
            alias: {
                "@": path.resolve(__dirname, "src")
            }
        },
        plugins: plugins(),
        devServer: {
            contentBase: path.resolve(__dirname, "dist"),
            writeToDisk: true,
            port: 4200,
            hot: isDev
        },
        devtool: "source-map",
        module: {
            rules: [
                {
                    enforce: "pre",
                    test: /\.js$/,
                    use: "source-map-loader"
                },
                {
                    test: /\.css$/,
                    use: cssLoaders(),
                },
                {
                    test: /\.(png|jpe?g|gif|jp2|webp)$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images/'
                    },
                    include: path.join(__dirname, 'src/assets/textures')
                },
                {
                    test: /\.(ttf|woff|woff2|eot)$/,
                    use: ["file-loader"],
                },
                {
                    test: /\.less$/,
                    use: cssLoaders("less-loader"),
                },
                {
                    test: /\.s[ac]ss$/,
                    use: cssLoaders("sass-loader"),
                },
                {
                    test: /\.(ts|tsx)$/,
                    use: [
                        {loader: "ts-loader", options: {transpileOnly: true}}
                    ],
                    // include: (path.resolve(__dirname, 'src') || path.resolve(__dirname, 'lib')),
                    exclude: /node_modules/
                },
            ]
        }
    }
    return config;
};
