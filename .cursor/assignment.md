# Senior Full-stack Engineering Take-home Assignment

## Assignment Details

This assignment will showcase your ability to build a full-stack system capable of handling and sending patient data to various EHR (Electronic Health Record) systems based on which EHR system is selected by the client (e.g. hospitals and clinics). This project will help evaluate understanding of transaction consistency, architectural choice, and practical problem-solving abilities.

**Technologies to Use**: Typescript and React (or any React-based framework)

## Problem Statement

The patient will be answering questions that the clinical team has set up for their doctor visit, and the EHR will be determined by the client (e.g. the hospital). Each question can have a different mapping in each EHR – for example:

- Answering a question about symptoms goes into one API endpoint for an EHR
- Answering a question about family history is submitted to a different API endpoint for the same EHR

## Requirements

### API Requirements

1. **Data Mapping Method** [ ]

   - Implement a method to map input data received from users to appropriate fields in EHR systems
   - Method should be flexible to handle different types of input data and EHR systems

2. **Transaction Management** [ ]

   - Implement a method to ensure transactions are written to the correct users in EHRs
   - Include validation checks and error handling

3. **EHR Integration Design** [ ]

   - Design API to allow addition of more EHR integrations without significant code changes
   - Consider modular design or standard interface for EHR integrations

4. **Scalability Planning** [ ]

   - Describe and plan an API design for scalability as user base grows
   - Consider efficient data structures, load balancing, and other scaling techniques

5. **Mapping Management System** [ ]

   - Implement a system for managing mappings for each EHR integration
   - Options include storing mappings in database or configuration files
   - Provide methods for updating and retrieving mappings

6. **Performance Optimization** [ ]

   - Implement performance measures for system scalability
   - Consider techniques like caching and efficient data structures

7. **Testing Strategy** [ ]

   - Design a comprehensive testing approach for the API
   - _Bonus_: Implement the testing strategy if time permits

8. **Bonus Features** [ ]
   - Support multi-language (questions and answers in Spanish and English)

### Frontend Requirements

1. **Mapping Management Tool** [ ]

   - Create an internal tool for team members to modify EHR mappings

2. **Error Handling** [ ]

   - Implement robust error handling and exception management
   - Validate and manage user inputs

3. **Testing Strategy** [ ]

   - Plan a testing approach for the frontend application
   - _Bonus_: Implement the testing strategy if time permits

4. **Bonus Features** [ ]
   - Support multi-language interface
   - Enable bulk patient changes for specific providers or hospitals

## Evaluation Criteria

The project will be assessed on:

- Overall system architecture
- API design
- Security aspects
- Code readability and modularity
- Approach to future-readiness

### Key Focus Areas

1. **Scalability**

   - Efficiently manage 10 million concurrent active users

2. **Backward Compatibility**

   - Robust and adaptive schema
   - Ensure new software versions don't disrupt existing operations

3. **Service Resiliency**

   - Maintain high service uptime
   - Implement fault tolerance, redundancy, and failover mechanisms

4. **Performance**

   - Process high request volumes
   - Optimize API speed and resource allocation

5. **Security**
   - Prioritize data protection
   - Use encryption and sanitization techniques
   - Strictly control data transmission, storage, and authorization

## Delivery Instructions

- Upload project zip to the provided Greenhouse link
- Include a README with:
  - Build/run instructions
  - Code documentation
  - Diagrams
  - Assumptions and architectural explanations

## Timeline

- Complete and submit within one week of receiving the assignment
- Estimated time: 4 hours
- Contact the team if you need additional time

## Example of EHR Mapping

### Athena EHR Mapping

```json
{
  "Athena": {
    "patient": {
      "name": "PATIENT_IDENT_NAME",
      "gender": "GENDER_OF_PATIENT",
      "dob": "DATE_OF_BIRTH_PATIENT",
      "address": "PATIENT_LOCATION_ADDRESS",
      "phone": "TELEPHONE_NUMBER_PATIENT",
      "email": "PATIENT_EMAIL_ID",
      "emergencyContact": "EMERGENCY_CONTACT_PATIENT",
      "insuranceProvider": "INSURANCE_PROVIDER_PATIENT",
      "insurancePolicyNumber": "POLICY_NUMBER_INSURANCE_PATIENT",
      "primaryCarePhysician": "PRIMARY_CARE_DOCTOR_PATIENT",
      "allergies": "ALLERGIES_PATIENT",
      "currentMedications": "PATIENT_MEDICATIONS_CURRENT",
      "medicalHistory": "HISTORY_MEDICAL_PATIENT",
      // This is usually previously diagnosed medical issues such as abdominal pain, shortness of breath, chest pain, injuries, past surgeries, etc.
      "socialHistory": "HISTORY_SOCIAL_PATIENT",
      // These are familial, occupational, and recreational aspects of the patient's life that can have the potential to be clinically significant. Think of alcohol, tobacco, drugs, diet, travel, etc.
      "familyHistory": "HISTORY_FAMILY_PATIENT"
      // This can be things like history of high blood pressure, cancer, stroke, diabet
    }
  }
}
```

### Allscripts EHR Mapping

```json
{
  "Allscripts": {
    "patient": {
      "p_name": "NAME_OF_PAT",
      "p_gender": "GENDER_PAT",
      "p_dob": "BIRTHDATE_OF_PAT",
      "p_address": "ADDRESS_PAT",
      "p_phone": "PHONE_NUMBER_PAT",
      "p_email": "EMAIL_ID_PAT",
      "p_emergencyContact": "EMERGENCY_CONTACT_PAT",
      "p_insuranceProvider": "PROVIDER_INSURANCE_PAT",
      "p_insurancePolicyNumber": "POLICY_NUM_INSURANCE_PAT",
      "p_primaryCarePhysician": "PRIMARY_CARE_DOC_PAT",
      "p_medicalHistory": "HISTORY_MEDICAL_PAT",
      "p_allergies": "ALLERGIES_PAT",
      "p_currentMedications": "CURRENT_MEDS_PAT",
      "p_socialHistory": "SOCIAL_HISTORY_PAT",
      "p_familyHistory": "FAMILY_HISTORY_PAT"
    }
  }
}
```

**Note**: This mapping demonstrates how different EHR systems may use different key names for the same type of patient information.
