const NAME_LARS = Cypress.env('NAME_LARS') || 'Foo bar';
const AGE_LARS = Cypress.env('AGE_LARS') || 27;
const ADDRESS_LARS = Cypress.env('ADDRESS_LARS') || '';
const ZIPCITY_LARS = Cypress.env('ZIPCITY_LARS') || '';
const PHONE_LARS = Cypress.env('PHONE_LARS') || '';

const NAME_LAERKE = Cypress.env('NAME_LAERKE') || 'Foo bar';
const AGE_LAERKE = Cypress.env('AGE_LAERKE') || 27;
const ADDRESS_LAERKE = Cypress.env('ADDRESS_LAERKE') || '';
const ZIPCITY_LAERKE = Cypress.env('ZIPCITY_LAERKE') || '';
const PHONE_LAERKE = Cypress.env('PHONE_LAERKE') || '';

// stop if test fails
afterEach(function () {
  if (this.currentTest.state === 'failed') {
    Cypress.runner.stop()
  }
});

const VACCINATION_PLACES = [
  {
    name: 'Øksnehallen, Halmtorvet 11, København V',
    inputId: 'ch_50088941-106780586',
  },
  {
    name: 'Bella Center, Ørestad Boulevard/Martha Christensens Vej, København S',
    inputId: 'ch_50088941-106780582',
  },
];

const PERSONS = [
  {
    name: NAME_LARS,
    age: AGE_LARS,
    address: ADDRESS_LARS,
    zipcity: ZIPCITY_LARS,
    phone: PHONE_LARS,
  },
  {
    name: NAME_LAERKE,
    age: AGE_LAERKE,
    address: ADDRESS_LAERKE,
    zipcity: ZIPCITY_LAERKE,
    phone: PHONE_LAERKE,
  },

];

const now = new Date();
const night = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() + 1, // the next day, ...
  0, 0, 0, // ...at 00:00:00 hours
);
const msTillMidnight = night.getTime() - now.getTime();

if (msTillMidnight < 300000) { // if less than 5 minutes to midnight. Wait
  const waitTime = msTillMidnight + 60000;

  describe('Wait for midnight', () => {
    it('Waits for ' + (waitTime / 1000) + ' seconds to pass...', () => {
      cy.wait(waitTime); // ms to midnight + a buffer on 60 seconds to accommodate for potential time-buffers on endsystem
    });
  });
}

const EMAIL_CONFIG = {
  EMAILSMTPHOST: Cypress.env('EMAILSMTPHOST'),
  EMAILSMTPORT: Cypress.env('EMAILSMTPORT'),
  EMAILAUTHUSER: Cypress.env('EMAILAUTHUSER'),
  EMAILAUTHPASS: Cypress.env('EMAILAUTHPASS'),
  FROMEMAIL: Cypress.env('FROMEMAIL'),
  TOEMAILS: Cypress.env('TOEMAILS')?.split(','),
}

PERSONS.forEach((person) => {
  VACCINATION_PLACES.forEach((vaccinationPlace, i) => {

    describe('Order vaccine from: ' + vaccinationPlace.name + ' for ' + person.name, () => {
      /* open page */
      it('Open page', () => {

        cy.log(person.name);
        cy.log(person.age);
        cy.log(person.address);
        cy.log(person.zipcity);
        cy.log(person.phone);

        cy.wait(2000);
        cy.visit('https://www.regionh.dk/presse-og-nyt/pressemeddelelser-og-nyheder/Sider/Tilmelding-til-at-modtage-overskydende-vaccine-mod-COVID-19.aspx');
        cy.wait(500);
      });
      it('Can click next', () => {
        const nextButton = cy.get('.next-area .next-button').first();
        nextButton.click();
      });

      /* name */
      it('Fill out firstname: ' + person.name, () => {
        const nameInputField = cy.get('.single-line input').first();
        nameInputField.type(person.name).blur();
      });
      it('Can click next after filling out first name', () => {
        const nextButton = cy.get('.next-area .next-button').first();
        nextButton.click();
      });

      /* age */
      it('Fill out age: ' + person.age, () => {
        const ageInputField = cy.get('.single-line input').first();
        ageInputField.type(person.age).blur();
      });
      it('Can click next after filling out age', () => {
        const nextButton = cy.get('.next-area .next-button').first();
        nextButton.click();
      });

      /* address */
      it('Fill out address: ' + person.address, () => {
        const addressInputField = cy.get('.single-line input').first();
        addressInputField.type(person.address).blur();
      });
      it('Can click next after filling out address', () => {
        const nextButton = cy.get('.next-area .next-button').first();
        nextButton.click();
      });

      /* zipcity */
      it('Fill out zip & city: ' + person.zipcity, () => {
        const zipCityInputField = cy.get('.single-line input').first();
        zipCityInputField.type(person.zipcity).blur();
      });
      it('Can click next after filling out zip & city', () => {
        const nextButton = cy.get('.next-area .next-button').first();
        nextButton.click();
      });

      /* phone */
      it('Fill out phone: ' + person.phone, () => {
        const phoneInputField = cy.get('.single-line input').first();
        phoneInputField.type(person.phone).blur();
      });
      it('Can click next after filling out phone', () => {
        const nextButton = cy.get('.next-area .next-button').first();
        nextButton.click();
      });

      /* ensure vaccination list is unchanged */
      it('Is the same list as when creating this script', () => {
        const firstOption = cy.get('.closed-vertical-choice').first();
        firstOption.contains('Ballerup, Baltorpvej 18').should('be.visible');


        const lastOption = cy.get('.closed-vertical-choice').last();
        lastOption.contains('Frederikssund Hospital').should('be.visible');
      });

      /* choose vaccination place */
      it('Choose vaccination place', () => {
        const vaccinationRadio = cy.get('label[for="' + vaccinationPlace.inputId + '"]').first();
        vaccinationRadio.click();
      });

      it('Can click next after chosing vaccination place', () => {
        const nextButton = cy.get('.next-area .next-button').first();
        nextButton.click();
      });

      /* submit form */
      it('Can submit form', () => {
        const nextButton = cy.get('.next-area .next-button').first();
        nextButton.click();
      });

      /* ensures form is submitted correctly */
      it('Ensures confirmation is visible', () => {
        cy.get('.questions .text-element strong').contains('Mange tak for din registrering').should('be.visible');
        cy.wait(5000);
      });

    });
  })
});

if (EMAIL_CONFIG.EMAILSMTPHOST) {
  describe('Sending mail to: ' + EMAIL_CONFIG.TOEMAILS.join(', '), () => {
    const places = VACCINATION_PLACES.map(x => x.name).join(', ')
    EMAIL_CONFIG.REGISTEREDTO = 'Du blev registreret til: ' + places

    it('Should send mail', () => {
      cy.task('sendMail', EMAIL_CONFIG).then(result => console.log(result));
      cy.wait(5000);
    });
  });
}
