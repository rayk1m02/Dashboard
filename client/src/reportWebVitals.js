const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ 
      getCLS,  // Cumulative Layout Shift - measures visual stability
      getFID,  // First Input Delay - measures interactivity
      getFCP,  // First Contentful Paint - measures loading performance
      getLCP,  // Largest Contentful Paint - measures loading performance
      getTTFB  // Time to First Byte - measures server response time
    }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals; 