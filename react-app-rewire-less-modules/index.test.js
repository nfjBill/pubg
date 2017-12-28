const subject = require("./index");

describe("CSS Modules rewire", () => {
    const getMockDevelopmentConfig = () => ({
        module: {
            rules: [
                {
                    test: /\.(js|jsx|mjs)$/,
                    enforce: "pre",
                    use: [{options: {}, loader: "/path/to/eslint-loader/index.js"}],
                    include: "/path/to/src"
                },
                {
                    oneOf: [
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            loader: "/path/to/url-loader/index.js",
                            options: {}
                        },
                        {
                            test: /\.(js|jsx|mjs)$/,
                            include: "/path/to/src",
                            loader: "/path/to/babel-loader/lib/index.js",
                            options: {}
                        },
                        {
                            test: /\.css$/,
                            use: [
                                "/path/to/style-loader/index.js",
                                {
                                    loader: "/path/to/css-loader/index.js",
                                    options: {importLoaders: 1}
                                },
                                {
                                    loader: "/path/to/postcss-loader/lib/index.js",
                                    options: {}
                                }
                            ]
                        },
                        {
                            exclude: [/\.js$/, /\.html$/, /\.json$/],
                            loader: "/path/to/file-loader/dist/cjs.js",
                            options: {name: "static/media/[name].[hash:8].[ext]"}
                        }
                    ]
                }
            ]
        }
    });

    const getMockProductionConfig = () => ({
        module: {
            rules: [
                {
                    test: /\.(js|jsx|mjs)$/,
                    enforce: "pre",
                    use: [{options: {}, loader: "/path/to/eslint-loader/index.js"}],
                    include: "/path/to/src"
                },
                {
                    oneOf: [
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            loader: "/path/to/url-loader/index.js",
                            options: {}
                        },
                        {
                            test: /\.(js|jsx|mjs)$/,
                            include: "/path/to/src",
                            loader: "/path/to/babel-loader/lib/index.js",
                            options: {}
                        },
                        {
                            test: /\.css$/,
                            loader: [
                                {
                                    loader: "/path/to/extract-text-webpack-plugin/dist/loader.js",
                                    options: {}
                                },
                                {
                                    loader: "/path/to/style-loader/index.js",
                                    options: {}
                                },
                                {
                                    loader: "/path/to/css-loader/index.js",
                                    options: {
                                        importLoaders: 1,
                                        minimize: true,
                                        sourceMap: true
                                    }
                                },
                                {
                                    loader: "/path/to/postcss-loader/lib/index.js",
                                    options: {}
                                }
                            ]
                        },
                        {
                            exclude: [/\.js$/, /\.html$/, /\.json$/],
                            loader: "/path/to/file-loader/dist/cjs.js",
                            options: {name: "static/media/[name].[hash:8].[ext]"}
                        }
                    ]
                }
            ]
        }
    });

    describe("CSS loaders", () => {
        describe("development", () => {
            const result = subject(getMockDevelopmentConfig());
            const cssLoader = result.module.rules[1].oneOf[2];
            const cssModulesLoader = result.module.rules[1].oneOf[3];

            it("should leave the regular loader configuration intact", () => {
                expect(cssLoader.use[1].options).toEqual({
                    importLoaders: 1
                });
            });

            it("should create a modules loader", () => {
                expect(cssModulesLoader.exclude).toBeUndefined();
                expect(cssModulesLoader.use[1].options).toEqual({
                    importLoaders: 1,
                });
            });
        });

        describe("production", () => {
            const result = subject(getMockProductionConfig());
            const cssLoader = result.module.rules[1].oneOf[2];
            const cssModulesLoader = result.module.rules[1].oneOf[3];

            it("should leave the regular loader configuration intact", () => {
                expect(cssLoader.loader[2].options).toEqual({
                    importLoaders: 1,
                    minimize: true,
                    sourceMap: true
                });
            });
        });
    });

    describe("less loaders", () => {
        describe("development", () => {
            const localIdentName = "dev-[hash:base64:8]";
            const loaderOptions = {
                modifyVars: {
                    "@primary-color": "#61dafb"
                }
            };
            const result = subject.withLoaderOptions(loaderOptions, localIdentName)(
                getMockDevelopmentConfig()
            );
            const cssLoader = result.module.rules[1].oneOf[2];
            const cssModulesLoader = result.module.rules[1].oneOf[3];
            const lessLoader = result.module.rules[1].oneOf[4];
            const lessModulesLoader = result.module.rules[1].oneOf[5];

            describe("regular loader", () => {
                it("should configure a regular loader", () => {
                    expect(lessLoader.test).toEqual(/\.less$/);
                });
                it("should append the less-loader", () => {
                    expect(lessLoader.use[3].loader).toContain("/less-loader/");
                });
                it("should have correct loader options", () => {
                    expect(
                        lessLoader.use[3].options.modifyVars["@primary-color"]
                    ).toEqual(loaderOptions.modifyVars["@primary-color"]);
                });
            });
        });

        describe("production", () => {
            const localIdentName = "prod-[hash:base64:8]";
            const loaderOptions = {
                modifyVars: {
                    "@primary-color": "#1DA57A"
                }
            };
            const result = subject.withLoaderOptions(loaderOptions, localIdentName)(
                getMockProductionConfig()
            );
            const cssLoader = result.module.rules[1].oneOf[2];
            const cssModulesLoader = result.module.rules[1].oneOf[3];
            const lessLoader = result.module.rules[1].oneOf[4];
            const lessModulesLoader = result.module.rules[1].oneOf[5];

            describe("regular loader", () => {
                it("should configure a regular loader", () => {
                    expect(lessLoader.test).toEqual(/\.less$/);
                });
                it("should append the less-loader", () => {
                    expect(lessLoader.loader[4].loader).toContain("/less-loader/");
                });
                it("should have correct loader options", () => {
                    expect(
                        lessLoader.loader[4].options.modifyVars["@primary-color"]
                    ).toEqual(loaderOptions.modifyVars["@primary-color"]);
                });
            });
        });
    });
});