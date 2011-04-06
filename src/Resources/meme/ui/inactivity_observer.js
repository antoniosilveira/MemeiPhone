/***************************************************
Search field inactivity observer for Titanium.

The observer class allows you to observe a text or search
field and execute actions after some period of inactivity.

Usage:
	// create observer instance
	// (you don't necessarily have to store it in a variable)
	var observer = meme.ui.inactivityObserver({
		fieldToObserve: searchField,
		inactivityTimeout: 1000,
		inactivityTimeoutAction: function() {
			// things to do on inactivity timeout
		}
	});
	
	// if for some reason you need to pause observer
	// (for instance, to avoid overriding user actions)
	observer.pauseObserver();
***************************************************/

(function(){
	
	meme.ui.inactivityObserver = function(params) {
		
		if (!params || !params.fieldToObserve || !params.inactivityTimeout || !params.inactivityTimeoutAction) {
			throw 'Please inform all necessary parameters.';
		}
		
		var observer = null, 
			observing = false,
			observedValue = null,
			lastObservedValue = null,
			observedField = null,
			timeoutAction = null;
		
		var startObserver = function() {
			if (!observing) {
				observedField = params.fieldToObserve;
				timeoutAction = params.inactivityTimeoutAction;
				
				observedField.addEventListener('change', function() {
					update(observedField.value);
				});
				
				Ti.API.debug('search field monitor started');
				observing = true;
				observer = setInterval(observeSearchFieldChanges, params.inactivityTimeout);
			}
		};
		
		var stopObserving = function() {
			clearInterval(observer);
			observing = false;
			observedValue = null;
			lastObservedValue = null;
		};
		
		var pauseObserver = function() {
			observedValue = null;
			lastObservedValue = null;
		}
		
		var observeSearchFieldChanges = function() {
			if (observedValue) {
				if (observedValue == lastObservedValue) {
					Ti.API.debug('TIMEOUT reached with no changes, firing search!');
					if (timeoutAction) {
						timeoutAction();
					}
					pauseObserver();
				} else {
					lastObservedValue = observedValue;
				}
			}
		};
		
		var update = function(newValue) {
			observedValue = newValue;
		};
		
		startObserver();
		
		return {
			pauseObserver: pauseObserver
		}
	}
	
})();