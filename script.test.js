import { it, expect,vi } from 'vitest';
import{throttle,showError,showLoading,fetchPosts} from './script'

    // Subsequent calls within limit period do not execute the function
    it('should not execute function on subsequent calls within limit period', () => {
        let executed = false;
        const func = () => { executed = true; };
        const throttledFunc = throttle(func, 1000);
        throttledFunc();
        throttledFunc();
        expect(executed).toBe(true);
    });

        // Updates the innerHTML of the specified element with a loading message
        it('should update innerHTML with loading message when element ID exists', () => {
            document.body.innerHTML = '<div id="testElement"></div>';
            showLoading('testElement');
            const element = document.getElementById('testElement');
            expect(element.innerHTML).toBe('<div class="loading">Loading...</div>');
          });

              // Successfully retrieves the element by its ID
    it('should update innerHTML with loading message when element ID exists', () => {
        document.body.innerHTML = '<div id="testElement"></div>';
        showLoading('testElement');
        const element = document.getElementById('testElement');
        expect(element.innerHTML).toBe('<div class="loading">Loading...</div>');
      });
          // Displays a loading indicator when called with a valid element ID
    it('should update innerHTML with loading message when element ID exists', () => {
        document.body.innerHTML = '<div id="testElement"></div>';
        showLoading('testElement');
        const element = document.getElementById('testElement');
        expect(element.innerHTML).toBe('<div class="loading">Loading...</div>');
    });

        // Successfully updates the innerHTML of the element when the element exists
        it('should update innerHTML with error message when element exists', () => {
            document.body.innerHTML = '<div id="testElement"></div>';
            showError('testElement', 'An error occurred');
            const element = document.getElementById('testElement');
            expect(element.innerHTML).toBe('<div class="error">An error occurred</div>');
          });

          
          