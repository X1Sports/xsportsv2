// This script prevents logos in the university logo section from having black backgrounds
document.addEventListener('DOMContentLoaded', function() {
  // Clear any black backgrounds from logos in the university section
  function clearLogoBackgrounds() {
    // Target the search-trainers section logo container
    var logoContainer = document.querySelector('.overflow-x-auto');
    
    if (logoContainer) {
      // Find all logo images and their parent elements
      var logoParents = logoContainer.querySelectorAll('div');
      var logoImages = logoContainer.querySelectorAll('img');
      
      // Clear background color from all parent elements
      logoParents.forEach(function(parent) {
        parent.style.backgroundColor = 'transparent';
        parent.style.background = 'transparent';
      });
      
      // Add a class to prevent other scripts from changing these
      logoContainer.classList.add('logo-backgrounds-cleared');
    }
  }
  
  // Run once immediately
  clearLogoBackgrounds();
  
  // Run again after a delay (let the other scripts run first)
  setTimeout(clearLogoBackgrounds, 1000);
  
  // Run periodically to ensure it stays fixed
  setInterval(clearLogoBackgrounds, 2000);
});
