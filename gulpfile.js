const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');


function css(done){
    //Identificamos el archivo
    src('./src/sass/main.scss')
        .pipe(
            sourcemaps.init()
        )
        .pipe(
            //Compilamos el archivo scss
            sass()
        )
        .pipe(
            //Estas dependencias son para modificar y optimizar el código css
            postcss([autoprefixer(), cssnano()])
        )
        .pipe(
            sourcemaps.write('.')
        )
        .pipe(
            //Lo guardamos en la ruta indicada
            dest('./build/css')
        )
    done();
}

function img(done){
    //identificamos todas las imagenes, sin importar el formato
    src('./src/img/**/*')
        .pipe(
            //Optimizamos las imagenes
            imagemin({optimizationLevel:3})
        )
        .pipe(
            //Las guardamos en la carpeta destino
            dest("./build/img")
        )
    done();
}

function webpVersion(done) {
    src('./src/img/**/*.{jpg,png}')
        .pipe(
            webp()
        )
        .pipe(
            dest('./build/img')
        )
    done();
}

function avifVersion(done) {
    src('./src/img/**/*.{jpg,png}')
        .pipe(
            avif()
        )
        .pipe(
            dest('./build/img')
        )
    done();
}

function dev(){
    //Funcion para escuchar todos los campos y en consecuencia llamra a esa funcion
    watch('./src/sass/**/*.scss',css);
    watch('./src/img/**/*',img);
}

exports.css = css;
exports.dev=dev;
exports.img=img;
exports.webpVersion=webpVersion;
exports.avifVersion = avifVersion;

exports.default = series(img, webpVersion, avifVersion, css, dev);