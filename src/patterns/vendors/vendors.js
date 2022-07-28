function filterVendors(vendors, filter) {
  let numVendors = 0;
  vendors.forEach((vendor) => {
    if (
      filter === 'All' ||
      (vendor.dataset.groups && vendor.dataset.groups.includes(filter))
    ) {
      // Show it.
      vendor.style.display = '';
      numVendors++;
    } else {
      // Hide it.
      vendor.style.display = 'none';
    }
  });

  return numVendors;
}

export default function init() {
  const dom = {};
  dom.root = document.querySelector('.vendors');
  dom.vendors = Array.from(dom.root?.querySelectorAll('.vendor') || []);
  dom.select = dom.root?.querySelector('#vendors-filter');
  dom.empty = dom.root?.querySelector('.vendors__empty');

  // Add filter functionality.
  if (!dom.select) return;
  dom.select.addEventListener('change', (event) => {
    const numVendors = filterVendors(dom.vendors, event.target.value);
    if (numVendors) {
      dom.empty.style.display = 'none';
    } else {
      dom.empty.style.display = 'block';
    }
  });
}
