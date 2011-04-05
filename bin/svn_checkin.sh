#!/bin/bash

# This script checks in necessary files on SVN work dir.

SVN_DIR=${SVN_DIR:-../tmp/MemeiPhone_trunk/}

for file in `svn st ${SVN_DIR} | awk -F" " '{print $1 "|" $2}'`; do
	fstatus=`echo $file | cut -d"|" -f1`
	fname=`echo $file | cut -d"|" -f2`
	
	if [ "$fstatus" == "?" ]; then
		if [[ "$fname" == *@* ]]; then
			svn add $fname@;
		else
			svn add $fname;
		fi
	fi
	if [ "$fstatus" == "!" ]; then
		if [[ "$fname" == *@* ]]; then
			svn rm $fname@;
		else
			svn rm $fname;
		fi
	fi
	if [ "$fstatus" == "~" ]; then
		rm -rf $fname
		svn up $fname
	fi
done
