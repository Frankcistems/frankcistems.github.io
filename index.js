(() => {
  // src/cms/populate-external-data/index.ts
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    "cmsfilter",
    async (filtersInstances) => {
      const [filtersInstance] = filtersInstances;
      const { listInstance } = filtersInstance;
      const [firstItem] = listInstance.items;
      const itemTemplateElement = firstItem.element;
      const jobs = await fetchJobs();
      listInstance.clearItems();
      const newItems = jobs.map((job) => createItem(job, itemTemplateElement));
      await listInstance.addItems(newItems);
      const filterTemplateElement = filtersInstance.form.querySelector('[data-element="filter"]');
      if (!filterTemplateElement)
        return;
      const filtersWrapper = filterTemplateElement.parentElement;
      if (!filtersWrapper)
        return;
      filterTemplateElement.remove();
      const categories = collectCategories(jobs);
      for (const category of categories) {
        const newFilter = createFilter(category, filterTemplateElement);
        if (!newFilter)
          continue;
        filtersWrapper.append(newFilter);
      }
      filtersInstance.storeFiltersData();
    }
  ]);
  var fetchJobs = async () => {
    try {
      const response = await fetch("https://nuageasospforcontemporarylocums.my.salesforce-sites.com/services/apexrest/JobsList");
      const data = await response.json();
      return data;
    } catch (error) {
      return [];
    }
  };
  var createItem = (job, templateElement) => {
    const newItem = templateElement.cloneNode(true);
    const jobTitle = newItem.querySelector('[data-element="jobTitle"]');
    const providerType = newItem.querySelector('[data-element="providerType"]');
    const specialty = newItem.querySelector('[data-element="category"]');
    const locationCity = newItem.querySelector('[data-element="locationCity"]');
    const locationState = newItem.querySelector('[data-element="locationState"]');
    const startDate = newItem.querySelector('[data-element="startDate"]');
    const numberOfPositions = newItem.querySelector('[data-element="numberOfPositions"]');
    if (jobTitle)
    jobTitle.textContent = job.jobTitle;
    if (providerType)
    providerType.textContent = job.providerType;
    if (specialty)
    specialty.textContent = job.specialty;
    if (locationCity)
    locationCity.textContent = job.locationCity;
    if (locationState)
    locationState.textContent = job.locationState;
    if (startDate)
    startDate.textContent = job.startDate;
    if (numberOfPositions)
    numberOfPositions.textContent = job.numberOfPositions;
    return newItem;
  };
  var collectCategories = (jobs) => {
    const categories = /* @__PURE__ */ new Set();
    for (const { category } of jobs) {
      categories.add(category);
    }
    return [...categories];
  };
  var createFilter = (category, templateElement) => {
    const newFilter = templateElement.cloneNode(true);
    const label = newFilter.querySelector("span");
    const radio = newFilter.querySelector("input");
    if (!label || !radio)
      return;
    label.textContent = category;
    radio.value = category;
    return newFilter;
  };
})();
