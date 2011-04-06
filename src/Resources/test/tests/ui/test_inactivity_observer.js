(function(){
	
	describe('meme.ui.inactivityObserver', function() {
		
		var exception = 'Please inform all necessary parameters.';
		
		it('should not start inactivity observer without parameters', function() {
			expect(meme.ui.inactivityObserver).toThrow(exception);
		});
		
		it('should not start inactivity observer with wrong parameters', function() {
			try {
				meme.ui.inactivityObserver({});
			} catch(e) {
				expect(e).toEqual(exception);
			}
		});
		
		it('should not start inactivity observer with null parameters', function() {
			try {
				meme.ui.inactivityObserver({
					fieldToObserve: null,
					inactivityTimeout: null,
					inactivityTimeoutAction: null
				});
			} catch(e) {
				expect(e).toEqual(exception);
			}
		});
		
		it('should start inactivity observer with correct parameters', function() {
			expect(meme.ui.inactivityObserver({
				fieldToObserve: Ti.UI.createTextField(),
				inactivityTimeout: 1,
				inactivityTimeoutAction: function(){}
			})).toBeDefined();
		});
		
		it('should execute inactivity actions after timeout', function() {
			var executed = false;
			var my_field = Ti.UI.createTextField();
			
			runs(function() {
				meme.ui.inactivityObserver({
					fieldToObserve: my_field,
					inactivityTimeout: 100,
					inactivityTimeoutAction: function() {
						executed = true;
					}
				});
			});
			
			runs(function() {
				my_field.value = 'foo';
				my_field.fireEvent('change');
			});
			
			waits(300);
			
			runs(function() {
				expect(executed).toBeTruthy();
			});
		});
		
	});
		
})();

// sem params

// verificar se depois de observar o treco funciona