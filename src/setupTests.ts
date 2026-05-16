import '@testing-library/jest-dom'

// mapbox-gl tries to create a blob URL for its worker during module init,
// which jsdom doesn't support
global.URL.createObjectURL = () => ''
