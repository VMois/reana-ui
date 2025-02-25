#!/bin/sh
#
# This file is part of REANA.
# Copyright (C) 2018, 2019, 2020, 2021, 2022 CERN.
#
# REANA is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

# Quit on errors
set -o errexit

# Quit on unbound symbols
set -o nounset

check_script () {
    shellcheck run-tests.sh
}

check_sphinx () {
    sphinx-build -qnNW docs docs/_build/html
}

check_lint () {
    (cd reana-ui && yarn && yarn lint)
}

check_prettier () {
    (cd reana-ui && yarn && yarn prettier)
}

check_js_tests () {
    (cd reana-ui && yarn && yarn test --ci --passWithNoTests)
}

check_dockerfile () {
    docker run -i --rm hadolint/hadolint:v1.18.2 < Dockerfile
}

check_docker_build () {
    docker build -t reanahub/reana-ui .
}

check_all () {
    check_script
    check_sphinx
    check_lint
    check_prettier
    check_js_tests
    check_dockerfile
    check_docker_build
}

if [ $# -eq 0 ]; then
    check_all
    exit 0
fi

for arg in "$@"
do
    case $arg in
        --check-shellscript) check_script;;
        --check-sphinx) check_sphinx;;
        --check-lint) check_lint;;
        --check-prettier) check_prettier;;
        --check-js-tests) check_js_tests;;
        --check-dockerfile) check_dockerfile;;
        --check-docker-build) check_docker_build;;
        *)
    esac
done
