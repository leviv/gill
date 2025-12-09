/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDonorName, buildFecUrl } from './csvParser';

export interface DisplayedDonation {
	id: number;
	contributorName: string;
	amount: number;
	isCorporate: boolean;
	fecUrl?: string;
	x: number;
	y: number;
}

export class DonationGenerator {
	private individualDonations: any[];
	private corporateDonations: any[];
	private usedIndividualIndices = new Set<number>();
	private usedCorporateIndices = new Set<number>();
	private donationIdCounter = 0;

	constructor(individualDonations: any[], corporateDonations: any[]) {
		this.individualDonations = individualDonations;
		this.corporateDonations = corporateDonations;
	}

	generateIndividualDonation(windowWidth: number, windowHeight: number): {
		donation: DisplayedDonation;
		amount: number;
	} | null {
		if (this.individualDonations.length === 0) return null;

		let donationIndex: number;
		let attempts = 0;
		do {
			donationIndex = Math.floor(Math.random() * this.individualDonations.length);
			attempts++;
			if (attempts > 100) {
				this.usedIndividualIndices.clear();
			}
		} while (this.usedIndividualIndices.has(donationIndex) && attempts <= 100);

		this.usedIndividualIndices.add(donationIndex);
		const donation = this.individualDonations[donationIndex];

		const amount = Math.abs(parseFloat(donation.contribution_receipt_amount) || 0);
		const name = formatDonorName(donation);
		const fecUrl = buildFecUrl(donation.image_number);

		const id = this.donationIdCounter++;
		const x = Math.random() * (windowWidth - 240);
		const y = Math.random() * (windowHeight - 150);

		return {
			donation: {
				id,
				contributorName: name,
				amount,
				isCorporate: false,
				fecUrl,
				x,
				y
			},
			amount
		};
	}

	generateCorporateDonation(windowWidth: number, windowHeight: number): {
		donation: DisplayedDonation;
		amount: number;
	} | null {
		if (this.corporateDonations.length === 0) return null;

		let donationIndex: number;
		let attempts = 0;
		do {
			donationIndex = Math.floor(Math.random() * this.corporateDonations.length);
			attempts++;
			if (attempts > 100) {
				this.usedCorporateIndices.clear();
			}
		} while (this.usedCorporateIndices.has(donationIndex) && attempts <= 100);

		this.usedCorporateIndices.add(donationIndex);
		const donation = this.corporateDonations[donationIndex];

		const amount = Math.abs(parseFloat(donation.contribution_receipt_amount) || 0);
		const fecUrl = buildFecUrl(donation.image_number);

		const id = this.donationIdCounter++;
		const x = Math.random() * windowWidth - 120;
		const y = Math.random() * windowHeight - 75;

		return {
			donation: {
				id,
				contributorName:
					donation.contributor_name || donation.donor_committee_name || 'Anonymous Corp',
				amount,
				isCorporate: true,
				fecUrl,
				x,
				y
			},
			amount
		};
	}
}
