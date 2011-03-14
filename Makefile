export PROJECT_ROOT=$(shell pwd)
export TMP_DIR=$(PROJECT_ROOT)/tmp/
export SVN_DIR=$(TMP_DIR)/$(PROJECT_NAME)_trunk/

clean: clean-languages
	@rm -rf ${PROJECT_ROOT}/src/build/iphone/*
	@mkdir -p ${PROJECT_ROOT}/src/build/iphone/
	@echo "Deleted: ${PROJECT_ROOT}/src/build/iphone/*"

clean-languages:
	@PROJECT_ROOT=${PROJECT_ROOT} bash ${PROJECT_ROOT}/bin/i18n.sh clean

languages:
	@PROJECT_ROOT=${PROJECT_ROOT} bash ${PROJECT_ROOT}/bin/i18n.sh

launch-titanium:
	@echo "Building with Titanium..."
	@mkdir -p ${PROJECT_ROOT}/src/build/iphone/
	@PROJECT_ROOT=${PROJECT_ROOT} bash ${PROJECT_ROOT}/bin/titanium.sh

test:
	@echo "var testsEnabled = true;" > ${PROJECT_ROOT}/src/Resources/test/enabled.js
	@make launch-titanium
run:
	@mkdir -p ${PROJECT_ROOT}/src/Resources/test/
	@echo "" > ${PROJECT_ROOT}/src/Resources/test/enabled.js
	@make launch-titanium

build-verification:
	@if [ "`find ${PROJECT_ROOT}/src/build/iphone/ -type f | wc -l | sed 's/ //g'`" == "0" ]; then\
		echo "[ERROR] Please execute \"make run\" and run the application on simulator before publishing, so the compiled files can be generated.";\
		exit 1;\
	fi

svn-verification:
	@if [ "${SVN_USER}" == "" ]; then\
		echo "[ERROR] SVN_USER env variable is required for this make target";\
		echo "Please use: \"SVN_USER=gchapie make [target]\"";\
		exit 1;\
	fi

project-name-verification:
	@if [ "${PROJECT_NAME}" != "MemeiPhone" ] && [ "${PROJECT_NAME}" != "MimiPhone" ]; then\
		echo "[ERROR] PROJECT_NAME env variable is required for this make target";\
		echo "Please use one of the following:";\
		echo "- \"PROJECT_NAME=MemeiPhone ... make [target]\"";\
		echo "- \"PROJECT_NAME=MimiPhone ... make [target]\"";\
		exit 1;\
	fi

svn-checkout: svn-verification
	@echo "Downloading project from SVN..."
	@echo "SVN_USER: ${SVN_USER}"
	@echo "SVN_DIR: ${SVN_DIR}"
	@rm -rf ${SVN_DIR}
	@mkdir -p ${SVN_DIR}
	@svn co svn+ssh://${SVN_USER}@svn.corp.yahoo.com/yahoo/brickhouse/iwasay/etc/${PROJECT_NAME}/trunk ${SVN_DIR}

svn-checkin: svn-verification
	@echo "Checking in files on SVN..."
	@SVN_DIR=${SVN_DIR} bash ${PROJECT_ROOT}/bin/svn_checkin.sh

svn-commit: svn-verification
	@echo "Commiting changes to SVN..."
	@echo ">>> Please type your commit message (press Ctrl+D __ONLY ONCE__ and wait to finish):"
	@svn ci -m "`python -c "import sys; data = sys.stdin.read(); print data;"`" ${SVN_DIR}
	@rm -rf ${SVN_DIR}
	@echo "Done."

# TODO: patch main.m to put correct TI_APPLICATION_RESOURCE_DIR
publish: project-name-verification build-verification
	@echo "Start publishing project: ${PROJECT_NAME}"
	@make svn-checkout
	@make languages
	@echo "Deleting destination files..."
	@for FILE in `find ${SVN_DIR} | grep -v .svn | grep -v ${PROJECT_NAME}.xcodeproj | grep -v Entitlements.plist`;\
	do\
		if [ -f $$FILE ]; then rm -rf $$FILE; fi;\
	done
	@echo "Copying root files..."
	@cp -prf ${PROJECT_ROOT}/src/CHANGELOG.txt ${SVN_DIR}
	@cp -prf ${PROJECT_ROOT}/src/Info.plist ${SVN_DIR}
	@cp -prf ${PROJECT_ROOT}/src/LICENSE* ${SVN_DIR}
	@cp -prf ${PROJECT_ROOT}/src/manifest ${SVN_DIR}
	@cp -prf ${PROJECT_ROOT}/src/tiapp.xml ${SVN_DIR}
	@echo "Copying Resources..."
	@mkdir -p ${SVN_DIR}/Resources/
	@cp -prf ${PROJECT_ROOT}/src/Resources/images ${SVN_DIR}/Resources/
	@cp -prf ${PROJECT_ROOT}/src/Resources/iphone ${SVN_DIR}/Resources/
	@cp -prf ${PROJECT_ROOT}/src/Resources/lib ${SVN_DIR}/Resources/
	@cp -prf ${PROJECT_ROOT}/src/Resources/*.js ${SVN_DIR}/Resources/
	@cp -prf ${PROJECT_ROOT}/src/Resources/*.png ${SVN_DIR}/Resources/
	@echo "Copying Languages..."
	@cp -prf ${PROJECT_ROOT}/src/Resources/*.lproj ${SVN_DIR}/Resources/
	@echo "Disabling tests in destination..."
	@mkdir -p ${SVN_DIR}/Resources/test/
	@echo "" > ${SVN_DIR}/Resources/test/enabled.js
	@echo "Copying fonts..."
	@for FONT in `find . -type f -name "GothamRnd-*.otf"`;\
	do\
		cp -prf $$FONT ${SVN_DIR}/Resources/;\
	done
	@echo "Copying Titanium build directory..."
	@mkdir -p ${SVN_DIR}/build/iphone/
	@cp -prf ${PROJECT_ROOT}/src/build/iphone/Classes ${SVN_DIR}/build/iphone/
	@cp -prf ${PROJECT_ROOT}/src/build/iphone/headers ${SVN_DIR}/build/iphone/
	@cp -prf ${PROJECT_ROOT}/src/build/iphone/lib ${SVN_DIR}/build/iphone/
	@cp -prf ${PROJECT_ROOT}/src/build/iphone/Resources ${SVN_DIR}/build/iphone/
	@cp -prf ${PROJECT_ROOT}/src/build/iphone/Info.plist ${SVN_DIR}/build/iphone/
	@#cp -prf ${PROJECT_ROOT}/src/build/iphone/main.m ${SVN_DIR}/build/iphone/
	@cp -prf ${PROJECT_ROOT}/src/build/iphone/${PROJECT_NAME}_Prefix.pch ${SVN_DIR}/build/iphone/
	@cp -prf ${PROJECT_ROOT}/src/build/iphone/module.xcconfig ${SVN_DIR}/build/iphone/
	@cp -prf ${PROJECT_ROOT}/src/build/iphone/project.xcconfig ${SVN_DIR}/build/iphone/
	@echo "**************************************************"
	@echo "Please remember that the following file:"
	@echo "- '${PROJECT_ROOT}/src/build/iphone/${PROJECT_NAME}.xcodeproj/project.pbxproj'"
	@echo "Needs to be published manually (to avoid SVN conflicts)."
	@echo "**************************************************"
	@echo "Done."
	@make svn-checkin
	@make svn-commit

check-no-changes-on-git:
	@if [ "`git st | grep -v '#'`" != "nothing to commit (working directory clean)" ]; then\
		echo "[ERROR] There are uncommitted changes in your repository. Please commit files and try again.";\
		exit 1;\
	fi

mim: check-no-changes-on-git clean
	@echo "Deleting uneeded languages..."
	@rm -rvf ${PROJECT_ROOT}/src/i18n/en
	@rm -rvf ${PROJECT_ROOT}/src/i18n/es
	@rm -rvf ${PROJECT_ROOT}/src/i18n/pt
	@rm -rvf ${PROJECT_ROOT}/src/i18n/zh-Hant
	@rm -rvf ${PROJECT_ROOT}/src/Resources/en.lproj
	@rm -rvf ${PROJECT_ROOT}/src/Resources/es.lproj
	@rm -rvf ${PROJECT_ROOT}/src/Resources/pt.lproj
	@rm -rvf ${PROJECT_ROOT}/src/Resources/zh-Hant.lproj
	@echo "Deleting uneeded images..."
	@rm -rvf ${PROJECT_ROOT}/src/Resources/images/*_br.*
	@rm -rvf ${PROJECT_ROOT}/src/Resources/images/*_es.*
	@rm -rvf ${PROJECT_ROOT}/src/Resources/images/*_en.*
	@rm -rvf ${PROJECT_ROOT}/src/Resources/images/*_pt.*
	@rm -rvf ${PROJECT_ROOT}/src/Resources/images/*_zh.*
	@echo "Replace Meme files for Mim files..."
	@mv -v ${PROJECT_ROOT}/src/Info_mim.plist ${PROJECT_ROOT}/src/Info.plist
	@mv -v ${PROJECT_ROOT}/src/manifest_mim ${PROJECT_ROOT}/src/manifest
	@mv -v ${PROJECT_ROOT}/src/tiapp_mim.xml ${PROJECT_ROOT}/src/tiapp.xml
	@echo "Replace CFBundleName..."
	@mv ${PROJECT_ROOT}/src/Resources/id.lproj/InfoPlist.strings ${PROJECT_ROOT}/src/Resources/id.lproj/InfoPlist.strings.old
	@cat ${PROJECT_ROOT}/src/Resources/id.lproj/InfoPlist.strings.old | sed -e "s/MemeiPhone/MimiPhone/g" > ${PROJECT_ROOT}/src/Resources/id.lproj/InfoPlist.strings
	@rm -rf ${PROJECT_ROOT}/src/Resources/id.lproj/InfoPlist.strings.old
	@echo "\"Berhasil\" :)"
	@echo "* Don't forget to run the application before publishing it."

log:
	@tail -n100 -f ${PROJECT_ROOT}/src/build/iphone/build/build.log
