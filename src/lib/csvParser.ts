/* eslint-disable @typescript-eslint/no-explicit-any */
// Helper function to parse CSV line with quoted fields
export function parseCSVLine(line: string): string[] {
	const result: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];

		if (char === '"') {
			inQuotes = !inQuotes;
		} else if (char === ',' && !inQuotes) {
			result.push(current.trim());
			current = '';
		} else {
			current += char;
		}
	}
	result.push(current.trim());

	return result;
}

export function parseDonationsCSV(csvData: string) {
	const individualDonations: any[] = [];
	const corporateDonations: any[] = [];

	const lines = csvData.split('\n');
	const headers = parseCSVLine(lines[0]);

	for (let i = 1; i < lines.length; i++) {
		if (!lines[i].trim()) continue;

		const values = parseCSVLine(lines[i]);
		if (values.length > 0) {
			const donation: any = {};
			headers.forEach((header, index) => {
				donation[header] = values[index] || '';
			});

			// Categorize donations
			const entityType = donation.entity_type_desc?.toUpperCase();
			if (entityType === 'INDIVIDUAL') {
				individualDonations.push(donation);
			} else if (
				entityType === 'POLITICAL ACTION COMMITTEE' ||
				donation.contributor_name?.includes('LLC') ||
				donation.contributor_name?.includes('CORP') ||
				donation.contributor_name?.includes('INC')
			) {
				corporateDonations.push(donation);
			}
		}
	}

	return { individualDonations, corporateDonations };
}

export function formatDonorName(donation: any): string {
	if (donation.contributor_first_name && donation.contributor_last_name) {
		// Use first middle last format
		let name = donation.contributor_first_name;
		if (donation.contributor_middle_name) {
			name += ' ' + donation.contributor_middle_name;
		}
		name += ' ' + donation.contributor_last_name;
		return name;
	} else if (donation.contributor_name) {
		// Parse "LAST, FIRST" format
		const nameParts = donation.contributor_name.split(',').map((p: string) => p.trim());
		if (nameParts.length === 2) {
			return nameParts[1] + ' ' + nameParts[0]; // Convert to "FIRST LAST"
		} else {
			return donation.contributor_name;
		}
	}
	return 'Anonymous';
}

export function buildFecUrl(imageNumber: string | undefined): string | undefined {
	return imageNumber ? `https://docquery.fec.gov/cgi-bin/fecimg/?${imageNumber}` : undefined;
}
