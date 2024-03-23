import type { CMSFilters } from '../../types/CMSFilters';
import type { Job } from './types';

/**
 * Populate CMS Data from an external API.
 */
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsfilter',
  async (filtersInstances: CMSFilters[]) => {
    // Get the filters instance
    const [filtersInstance] = filtersInstances;

    // Get the list instance
    const { listInstance } = filtersInstance;

    // Save a copy of the template
    const [firstItem] = listInstance.items;
    const itemTemplateElement = firstItem.element;

    // Fetch external data
    const jobs = await fetchJobs();

    // Remove existing items
    listInstance.clearItems();

    // Create the new items
    const newItems = jobs.map((job) => createItem(job, itemTemplateElement));

    // Populate the list
    await listInstance.addItems(newItems);

    // Get the template filter
    const filterTemplateElement = filtersInstance.form.querySelector<HTMLLabelElement>('[data-element="filter"]');
    if (!filterTemplateElement) return;

    // Get the parent wrapper
    const filtersWrapper = filterTemplateElement.parentElement;
    if (!filtersWrapper) return;

    // Remove the template from the DOM
    filterTemplateElement.remove();

    // Collect the categories
    const categories = collectCategories(jobs);

    // Create the new filters and append the to the parent wrapper
    for (const category of categories) {
      const newFilter = createFilter(category, filterTemplateElement);
      if (!newFilter) continue;

      filtersWrapper.append(newFilter);
    }

    // Sync the CMSFilters instance with the new created filters
    filtersInstance.storeFiltersData();
  },
]);

/**
 * Fetches jobs from Saleforce API.
 * @returns An array of {@link Job}.
 */
const fetchJobs = async () => {
  try {
    const response = await fetch('https://nuageasospforcontemporarylocums.my.salesforce-sites.com/services/apexrest/JobsList');
    const data: Job[] = await response.json();

    return data;
  } catch (error) {
    return [];
  }
};

/**
 * Creates an item from the template element.
 * @param job The job data to create the item from.
 * @param templateElement The template element.
 *
 * @returns A new Collection Item element.
 */
const createItem = (job: Job, templateElement: HTMLDivElement) => {
  // Clone the template element
  const newItem = templateElement.cloneNode(true) as HTMLDivElement;

  // Query inner elements
  const jobTitle = newItem.querySelector<HTMLHeadingElement>('[data-element="jobTitle"]');
  const providerType = newItem.querySelector<HTMLDivElement>('[data-element="providerType"]');
  const specialty = newItem.querySelector<HTMLParagraphElement>('[data-element="specialty"]');
  const locationCity = newItem.querySelector<HTMLParagraphElement>('[data-element="locationCity"]');
  const locationState = newItem.querySelector<HTMLParagraphElement>('[data-element="locationState"]');
  const startDate = newItem.querySelector<HTMLParagraphElement>('[data-element="startDate"]');
  const numberOfPositions = newItem.querySelector<HTMLParagraphElement>('[data-element="numberOfPositions"]');

  // Populate inner elements
  if (jobTitle) jobTitle.textContent = job.jobTitle;
  if (providerType) providerType.textContent = job.providerType;
  if (specialty) specialty.textContent = job.specialty;
  if (locationCity) locationCity.textContent = job.locationCity;
  if (locationState) locationState.textContent = job.locationState;
  if (startDate) startDate.textContent = job.startDate;
  if (numberOfPositions) numberOfPositions.textContent = job.numberOfPositions;

  return newItem;
};


/**
 * Collects all the categories from the jobs' data.
 * @param jobs The jobs' data.
 *
 * @returns An array of {@link Job} categories.
 */
const collectCategories = (jobs: Job[]) => {
  const categories: Set<Job['category']> = new Set();

  for (const { category } of jobs) {
    categories.add(category);
  }

  return [...categories];
};

/**
 * Creates a new radio filter from the template element.
 * @param category The filter value.
 * @param templateElement The template element.
 *
 * @returns A new category radio filter.
 */
const createFilter = (category: Job['category'], templateElement: HTMLLabelElement) => {
  // Clone the template element
  const newFilter = templateElement.cloneNode(true) as HTMLLabelElement;

  // Query inner elements
  const label = newFilter.querySelector('span');
  const radio = newFilter.querySelector('input');

  if (!label || !radio) return;

  // Populate inner elements
  label.textContent = category;
  radio.value = category;

  return newFilter;
};
