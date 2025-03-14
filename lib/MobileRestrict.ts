// components/MobileRestrict.js

// Check user agent and screen size
export function checkMobile() {
    const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const isMobileUserAgent = Boolean(
    userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    )
    );
    
    // Additional check for small screen or touch support
    const isSmallScreen = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return isMobileUserAgent || (isSmallScreen && isTouchDevice);
};




