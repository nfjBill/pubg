const subject = require("./index");

describe("js loader rewire", () => {
  const getMockDevelopmentConfig = () => ({
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "/path/to/source-map-loader/index.js",
          enforce: 'pre',
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
  const result = subject(getMockDevelopmentConfig());

  describe("js pre loader", () => {
    const jsPreLoader = result.module.rules[0];

    it("Should get rid of the loader", () => {
      expect(jsPreLoader.loader).toEqual(undefined);
    });


    it("should append the eslint-loader", () => {
      expect(jsPreLoader.use[0].loader).toContain('/eslint-loader/');
    });
  });

  describe("js loader", () => {
    const jsLoader = result.module.rules[1].oneOf[3];

    it("should configure a regular loader", () => {
      expect(jsLoader.test).toEqual(/\.(js|jsx|mjs)$/);
    });

    it("should append the babel-loader", () => {
      expect(jsLoader.loader).toContain("/babel-loader/");
    });
  });
});
