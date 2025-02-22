const { src, dest, watch, parallel } = require("gulp");

// CSS
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");

// Imagenes
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");


// Javascript
const terser = require("gulp-terser-js");
const rename = require("gulp-rename");

//Webpack
const webpack = require("webpack-stream");

const paths = {
  scss: "src/scss/**/*.scss",
  js: "src/js/**/*.js",
  imagenes: "src/img/**/*",
};
function css() {
  return (
    src(paths.scss)
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: "expanded" }))
      .pipe(sourcemaps.write("."))
      .pipe(dest("build/css"))
  );
}
function javascript() {
  return (
    src(paths.js)
      .pipe(
        webpack({
          module: {
            rules: [
              {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
              },
            ],
          },
          mode: "production",
          watch: true,
          entry: "./src/js/app.js",
        })
      )
      .pipe(sourcemaps.init())
      // .pipe(concat("bundle.js"))
      .pipe(terser())
      .pipe(sourcemaps.write("."))
      .pipe(rename({ suffix: ".min" }))
      .pipe(dest("./build/js"))
  );
}

function imagenes() {
  return src(paths.imagenes)
    .pipe(cache(imagemin({ optimizationLevel: 3 })))
    .pipe(dest("build/img"));
}

function versionWebp(done) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{png,jpg,jpeg}")
    .pipe(webp(opciones))
    .pipe(dest("build/img"));
  done();
}


function dev(done) {
  watch(paths.scss, css);
  watch(paths.js, javascript);
  watch(paths.imagenes, imagenes);
  watch(paths.imagenes, versionWebp);
  done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.dev = parallel(
  css,
  imagenes,
  versionWebp,
  javascript,
  dev
);
