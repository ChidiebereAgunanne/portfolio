import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const titleElement = document.querySelector('.projects-title');
titleElement.textContent = `${projects.length} Projects`;

let query = '';
let searchInput = document.querySelector('.searchBar');
function renderPieChart(projectsGiven) {
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
  newData.sort((a, b) => b.label - a.label);

  let newArcGenerator = d3.arc().innerRadius(0).outerRadius(50); // ← added
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => newArcGenerator(d));        // ← fixed

  d3.select('svg').selectAll('path').remove();
  d3.select('.legend').selectAll('li').remove();

  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  newArcs.forEach((arc, i) => {                                   // ← fixed
    d3.select('svg').append('path').attr('d', arc).attr('fill', colors(i));
  });

  let legend = d3.select('.legend');
  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', 'legend-item')
      .html(`<span class="swatch"></span><span class="label">${d.label}</span><em>(${d.value})</em>`);
  });
}
renderPieChart(projects);

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});