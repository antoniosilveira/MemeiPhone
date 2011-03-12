#!/bin/bash

# This script checks in necessary files on SVN work dir.

SVN_DIR=${SVN_DIR:-../tmp/MemeiPhone_trunk/}

for file in `svn st ${SVN_DIR} | awk -F" " '{print $1 "|" $2}'`; do
	fstatus=`echo $file | cut -d"|" -f1`
	fname=`echo $file | cut -d"|" -f2`
	
	if [ "$fstatus" == "?" ]; then
		svn add $fname
	fi
	if [ "$fstatus" == "!" ]; then
		svn rm $fname
	fi
	if [ "$fstatus" == "~" ]; then
		rm -rf $fname
		svn up $fname
	fi
done
