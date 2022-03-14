// add any imports if needed, or write your script directly in this file.
// const SomePackage = require('PackageName');

// make sure to export main, with the signature
function main(el, service, imEntity, state, config) {
	if (!state) state = {};
	if (!el || !service || !imEntity || !state || !config) {
		throw new Error('Call main with correct signature');
	}

	let entity = Object.values(imEntity)[0];

	var query = {
		from: entity.class,
		select: ['identifier', 'inchiKey'],
		where: [
			{
				path: 'id',
				op: '=',
				value: entity.value
			}
		]
	};
	new imjs.Service(service).records(query).then(function(response) {
		let inchiKey = response[0].inchiKey;

		let contents = '<div>Not available.</div>';
		if (inchiKey) {
			if (entity.class == 'ChemblCompound') {
				contents =
					'<div id="structureimage">' +
					'<img src="https://www.ebi.ac.uk/chembl/api/data/image/' +
					inchiKey +
					'?dimensions=300&format=svg" onerror="document.getElementById(\'structureimage\').innerHTML = \'Not available.\'"/><br/><span style="font-size: 8px;">Provided by <a href="https://www.ebi.ac.uk/chembl/ws" target="_blank">ChEMBL web service</a></span></div>';
			} else {
				contents =
					'<div id="structureimage">' +
					'<img src="https://cactus.nci.nih.gov/chemical/structure/InChIKey=' +
					inchiKey +
					'/image" onerror="document.getElementById(\'structureimage\').innerHTML = \'Not available.\'"/><br/><span style="font-size: 8px;">Provided by <a href="https://cactus.nci.nih.gov/" target="_blank">The CACTUS web server</a></span></div>';
			}
		}

		el.innerHTML = '<div class="rootContainer">' + contents + '</div>';
	});
}

module.exports = { main };
