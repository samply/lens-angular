import {Inject, Injectable} from '@angular/core';
import {
  CatalogueService,
  LensConfig,
  QueryTranslator,
  Criteria,
  Condition,
  Operation,
  LENS_CONFIG_TOKEN
} from '@samply/lens-core';


@Injectable({
  providedIn: 'root'
})
export class CqlTranslatorService implements QueryTranslator {

  constructor(
    private catalogueService: CatalogueService,
    @Inject(LENS_CONFIG_TOKEN) private configuration: LensConfig
  ) {}

  alias = new Map<string, string>([
    ["icd10", "http://fhir.de/CodeSystem/bfarm/icd-10-gm"],
    ["loinc", "http://loinc.org"],
    ["gradingcs", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/GradingCS"],
    ["ops", "http://fhir.de/CodeSystem/bfarm/ops"],
    ["morph", "urn:oid:2.16.840.1.113883.6.43.1"],
    ["lokalisation_icd_o_3", "urn:oid:2.16.840.1.113883.6.43.1"],
    ["bodySite", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/SeitenlokalisationCS"],
    ["Therapieart", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/SYSTTherapieartCS"],
    ["specimentype", "https://fhir.bbmri.de/CodeSystem/SampleMaterialType"],
    ["uiccstadiumcs", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/UiccstadiumCS"],
    ["lokalebeurteilungresidualstatuscs", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/LokaleBeurteilungResidualstatusCS"],
    ["gesamtbeurteilungtumorstatuscs", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/GesamtbeurteilungTumorstatusCS"],
    ["verlauflokalertumorstatuscs", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/VerlaufLokalerTumorstatusCS"],
    ["verlauftumorstatuslymphknotencs", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/VerlaufTumorstatusLymphknotenCS"],
    ["verlauftumorstatusfernmetastasencs", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/VerlaufTumorstatusFernmetastasenCS"],
    ["vitalstatuscs", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/VitalstatusCS"],
    ["jnucs", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/JNUCS"],
    ["fmlokalisationcs", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/FMLokalisationCS"],
    ["TNMTCS", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/TNMTCS"],
    ["TNMNCS", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/TNMNCS"],
    ["TNMMCS", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/TNMMCS"],
    ["TNMySymbolCS", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/TNMySymbolCS"],
    ["TNMrSymbolCS", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/TNMrSymbolCS"],
    ["TNMmSymbolCS", "http://dktk.dkfz.de/fhir/onco/core/CodeSystem/TNMmSymbolCS"],
    ["molecularMarker", "http://www.genenames.org"]
  ])

  cqltemplate = new Map<string, string>([
    ["gender", "Patient.gender"],
    ["conditionValue", "exists [Condition: Code '{{C}}' from {{A1}}]"],
    ["conditionBodySite", "exists from [Condition] C\nwhere C.bodySite.coding contains Code '{{C}}' from {{A1}}"],
    //TODO Revert to first expression if https://github.com/samply/blaze/issues/808 is solved
    // ["conditionLocalization", "exists from [Condition] C\nwhere C.bodySite.coding contains Code '{{C}}' from {{A1}}"],
    ["conditionLocalization", "exists from [Condition] C\nwhere C.bodySite.coding.code contains '{{C}}'"],
    ["conditionRangeDate", "exists from [Condition] C\nwhere year from C.onset between {{D1}} and {{D2}}"],
    ["conditionLowerThanDate", "exists from [Condition] C\nwhere year from C.onset <= {{D2}}"],
    ["conditionGreaterThanDate", "exists from [Condition] C\nwhere year from C.onset >= {{D1}}"],
    ["conditionRangeAge", "exists [Condition] C\nwhere AgeInYearsAt(FHIRHelpers.ToDateTime(C.onset)) between {{D1}} and {{D2}}"],
    ["conditionLowerThanAge", "exists [Condition] C\nwhere AgeInYearsAt(FHIRHelpers.ToDateTime(C.onset)) <= {{D2}}"],
    ["conditionGreaterThanAge", "exists [Condition] C\nwhere AgeInYearsAt(FHIRHelpers.ToDateTime(C.onset)) >= {{D1}}"],
    //TODO Revert to first expression if https://github.com/samply/blaze/issues/808 is solved
    // ["observation", "exists from [Observation: Code '{{K}}' from {{A1}}] O\nwhere O.value.coding contains Code '{{C}}' from {{A2}}"],
    ["observation", "exists from [Observation: Code '{{K}}' from {{A1}}] O\nwhere O.value.coding.code contains '{{C}}'"],
    ["observationMetastasis", "exists from [Observation: Code '21907-1' from {{A1}}] O\nwhere O.value.coding.code contains '{{C}}'"],
    ["observationMetastasisBodySite", "exists from [Observation: Code '21907-1' from {{A1}}] O\nwhere O.bodySite.coding.code contains '{{C}}'"],
    ["observationMolecularMarkerName", "exists from [Observation: Code '69548-6' from {{A1}}] O\nwhere O.component.where(code.coding contains Code '{{K}}' from {{A1}}).value.coding contains Code '{{C}}' from {{A2}}"],
    ["observationMolecularMarkerAminoacidchange", "exists from [Observation: Code '69548-6' from {{A1}}] O\nwhere O.component.where(code.coding contains Code '{{K}}' from {{A1}}).value = '{{C}}'"],
    ["observationMolecularMarkerDNAchange", "exists from [Observation: Code '69548-6' from {{A1}}] O\nwhere O.component.where(code.coding contains Code '{{K}}' from {{A1}}).value = '{{C}}'"],
    ["observationMolecularMarkerSeqRefNCBI", "exists from [Observation: Code '69548-6' from {{A1}}] O\nwhere O.component.where(code.coding contains Code '{{K}}' from {{A1}}).value = '{{C}}'"],
    ["observationMolecularMarkerEnsemblID", "exists from [Observation: Code '69548-6' from {{A1}}] O\nwhere O.component.where(code.coding contains Code '{{K}}' from {{A1}}).value = '{{C}}'"],
    ["procedure", "exists [Procedure: category in Code '{{K}}' from {{A1}}]"],
    ["procedureResidualstatus", "exists from [Procedure: category in Code 'OP' from {{A1}}] P\nwhere P.outcome.coding.code contains '{{C}}'"],
    ["medicationStatement", "exists [MedicationStatement: category in Code '{{K}}' from {{A1}}]"],
    ["hasSpecimen", "exists [Specimen]"],
    ["specimen", "exists [Specimen: Code '{{C}}' from {{A1}}]"],
    ["TNM-x", "exists from [Observation: Code '21908-9' from {{A1}}] O\nwhere O.component.where(code.coding contains Code '{{K}}' from {{A1}}).value.coding contains Code '{{C}}' from {{A2}}"],
    ["Organization", "Patient.managingOrganization.reference = \"Organization Ref\"('Klinisches Krebsregister/ITM')"],
    ["department", "exists from [Encounter] I\nwhere I.identifier.value = '{{C}}' "],

  ])

  criterionMap = new Map<string, {type: string, alias?: string[]}>([
    ["gender", {type: "gender"}],
    ["diagnosis", {type: "conditionValue", alias: ["icd10"]}],
    ["bodySite", {type: "conditionBodySite", alias: ["bodySite"]}],
    ["urn:oid:2.16.840.1.113883.6.43.1", {type: "conditionLocalization", alias: ["lokalisation_icd_o_3"]}],
    ["59542-1", {type: "observation", alias: ["loinc", "gradingcs"]}],  //grading
    ["metastases_present", {type: "observationMetastasis", alias: ["loinc", "jnucs"]}],  //Fernmetastasen vorhanden
    ["localization_metastases", {type: "observationMetastasisBodySite", alias: ["loinc", "fmlokalisationcs"]}],  //Fernmetastasen
    ["OP", {type: "procedure", alias: ["Therapieart"]}],                        //Operation
    ["ST", {type: "procedure", alias: ["Therapieart"]}],                        //Strahlentherapie
    ["CH", {type: "medicationStatement", alias: ["Therapieart"]}],              //Chemotherapie
    ["HO", {type: "medicationStatement", alias: ["Therapieart"]}],              //Hormontherapie
    ["IM", {type: "medicationStatement", alias: ["Therapieart"]}],              //Immuntherapie
    ["KM", {type: "medicationStatement", alias: ["Therapieart"]}],              //Knochenmarktransplantation
    ["59847-4", {type: "observation", alias: ["loinc", "morph"]}],      //Morphologie
    ["year_of_diagnosis", {type: "conditionRangeDate"}],
    ["sample_kind", {type: "specimen", alias: ["specimentype"]}],
    ["pat_with_samples", {type: "hasSpecimen"}],
    ["age_at_diagnosis", {type: "conditionRangeAge"}],
    ["21908-9", {type: "observation", alias: ["loinc", "uiccstadiumcs"]}],  //uicc
    ["21905-5", {type: "TNM-x", alias: ["loinc", "TNMTCS"]}],  //tnm component
    ["21906-3", {type: "TNM-x", alias: ["loinc", "TNMNCS"]}],  //tnm component
    ["21907-1", {type: "TNM-x", alias: ["loinc", "TNMMCS"]}],  //tnm component
    ["42030-7", {type: "TNM-x", alias: ["loinc", "TNMmSymbolCS"]}],  //tnm component
    ["59479-6", {type: "TNM-x", alias: ["loinc", "TNMySymbolCS"]}],  //tnm component
    ["21983-2", {type: "TNM-x", alias: ["loinc", "TNMrSymbolCS"]}],  //tnm component
    ["Organization", {type: "Organization"}],  //organization
    ["48018-6", {type: "observationMolecularMarkerName", alias: ["loinc", "molecularMarker"]}],  //molecular marker name
    ["48005-3", {type: "observationMolecularMarkerAminoacidchange", alias: ["loinc"]}],  //molecular marker
    ["81290-9", {type: "observationMolecularMarkerDNAchange", alias: ["loinc"]}],  //molecular marker
    ["81248-7", {type: "observationMolecularMarkerSeqRefNCBI", alias: ["loinc"]}],  //molecular marker
    ["81249-5", {type: "observationMolecularMarkerEnsemblID", alias: ["loinc"]}],  //molecular marker


    ["local_assessment_residual_tumor", {type: "procedureResidualstatus", alias: ["Therapieart", "lokalebeurteilungresidualstatuscs"]}],  //lokalebeurteilungresidualstatuscs
    ["21976-6", {type: "observation", alias: ["loinc", "gesamtbeurteilungtumorstatuscs"]}], //GesamtbeurteilungTumorstatus
    ["LA4583-6", {type: "observation", alias: ["loinc", "verlauflokalertumorstatuscs"]}],  //LokalerTumorstatus
    ["LA4370-8", {type: "observation", alias: ["loinc", "verlauftumorstatuslymphknotencs"]}],  //TumorstatusLymphknoten
    ["LA4226-2", {type: "observation", alias: ["loinc", "verlauftumorstatusfernmetastasencs"]}],  //TumorstatusFernmetastasen
    ["75186-7", {type: "observation", alias: ["loinc", "vitalstatuscs"]}],  //Vitalstatus
    //["Organization", {type: "Organization"}],
    ["Organization", {type: "department"}],
  ])

  criteria!: Criteria

  codesystems: string[] = []

  transform(query: Operation): string {
    this.criteria = this.catalogueService.getCriteria("diagnosis")
    this.codesystems = [
      // NOTE: We always need loinc, as the Deceased Stratifier is computed with it!!!
      "codesystem loinc: 'http://loinc.org'"
    ]
    const cqlHeader = "library Retrieve\n" +
      "using FHIR version '4.0.0'\n" +
      "include FHIRHelpers version '4.0.0'\n" +
      "\n"

    let singletons: string = (this.configuration.backendMeasureReplacement)
      ? "DKTK_STRAT_DEF_IN_INITIAL_POPULATION\n"
      : "define InInitialPopulation:\n"

    query.children.forEach((criterion: Operation | Condition) => {
      singletons += this.getSingleton(criterion)
    })


    if(query.children.length == 0) {
      singletons += "true"
    } else {
      singletons = singletons.slice(0, -5)
    }

    return cqlHeader +
      this.getCodesystems() +
      "context Patient\n" +
      this.configuration.resultRequests.map(request => request.cql).join("") +
      singletons
  }

  getSingleton(criterion: Operation | Condition): string {
    let expression: string = ""
    if (criterion instanceof Condition) {
      const myCriterion = this.criterionMap.get(criterion.key)
      if (myCriterion) {
        const myCQL = this.cqltemplate.get(myCriterion.type)
        if (myCQL) {
          expression += '('
          switch (myCriterion.type) {

            case "gender": {
              expression += myCQL
              if(criterion.value instanceof Array<string>) {
                if (criterion.value.length === 1) {
                  expression += " = '" + criterion.value[0] + "') and\n"
                } else {expression += " in { "
                  criterion.value.forEach((value: string) => {
                    expression += "'" + value + "', "
                  })
                  expression = expression.slice(0, -2) + " }) and\n"
                }
              }
              break
            }

            case "conditionValue":
            case "conditionBodySite":
            case "conditionLocalization":
            case "observation":
            case "observationMetastasis":
            case "observationMetastasisBodySite":
            case "procedure":
            case "procedureResidualstatus":
            case "medicationStatement":
            case "specimen":
            case "hasSpecimen":
            case "Organization":
            case "observationMolecularMarkerName":
            case "observationMolecularMarkerAminoacidchange":
            case "observationMolecularMarkerDNAchange":
            case "observationMolecularMarkerSeqRefNCBI":
            case "observationMolecularMarkerEnsemblID":
            case "department":
            case "TNM-x": {
              if (typeof criterion.value === "string") {
                if (criterion.value.slice(-1) === "%") {
                  const mykey = criterion.value.slice(0, -2)
                  if (this.criteria.values != undefined) {
                    let expandedValues = this.criteria.values
                      .filter(value => value.key.indexOf(mykey) != -1)
                      .map(value => value.key)
                    expression += this.getSingleton(
                      new Condition(
                        criterion.key,
                        criterion.type,
                        criterion.system,
                        expandedValues,
                      )
                    ).substring(1)
                  }
                } else {
                  expression += this.substituteCQLExpression(criterion.key, myCriterion.alias, myCQL, criterion.value as string) + ") and\n"
                }
              }
              if (typeof criterion.value === "boolean") {
                expression += this.substituteCQLExpression(criterion.key, myCriterion.alias, myCQL) + ") and\n"
              }
              if (criterion.value instanceof Array<string>) {
                if (criterion.value.length === 1) {
                  expression += this.substituteCQLExpression(criterion.key, myCriterion.alias, myCQL, criterion.value[0]) + ") and\n"
                } else {
                  criterion.value.forEach((value: string) => {
                    expression += "(" + this.substituteCQLExpression(criterion.key, myCriterion.alias, myCQL, value) + ") or\n"
                  })
                  expression = expression.slice(0, -4) + ") and\n"
                }
              }
              break
            }

            case "conditionRangeDate":
              if (typeof criterion.value == "object"
                && !(criterion.value instanceof Array<string>)) {
                if (criterion.type == "LOWER_THAN") {
                  let lowerThanDateTemplate = this.cqltemplate.get("conditionLowerThanDate")
                  if (lowerThanDateTemplate)
                    expression += this.substituteCQLExpression(criterion.key, myCriterion.alias, lowerThanDateTemplate, "", criterion.value.min as number, criterion.value.max as number) + ") and\n"
                } else if (criterion.type == "GREATER_THAN") {
                  let greaterThanDateTemplate = this.cqltemplate.get("conditionGreaterThanDate")
                  if (greaterThanDateTemplate)
                    expression += this.substituteCQLExpression(criterion.key, myCriterion.alias, greaterThanDateTemplate, "", criterion.value.min as number, criterion.value.max as number) + ") and\n"
                } else {
                  expression += this.substituteCQLExpression(criterion.key, myCriterion.alias, myCQL, "", criterion.value.min as number, criterion.value.max as number) + ") and\n"
                }
              }
              break


            case "conditionRangeAge": {
              if (typeof criterion.value == "object"
                && !(criterion.value instanceof Array<string>)) {
                if (criterion.type == "LOWER_THAN") {
                  let lowerThanAgeTemplate = this.cqltemplate.get("conditionLowerThanAge")
                  if (lowerThanAgeTemplate)
                    expression += this.substituteCQLExpression(criterion.key, myCriterion.alias, lowerThanAgeTemplate, "", criterion.value.min as number, criterion.value.max as number) + ") and\n"
                } else if (criterion.type == "GREATER_THAN") {
                  let greaterThanAgeTemplate = this.cqltemplate.get("conditionGreaterThanAge")
                  if (greaterThanAgeTemplate)
                    expression += this.substituteCQLExpression(criterion.key, myCriterion.alias, greaterThanAgeTemplate, "", criterion.value.min as number, criterion.value.max as number) + ") and\n"
                } else {
                  expression += this.substituteCQLExpression(criterion.key, myCriterion.alias, myCQL, "", criterion.value.min as number, criterion.value.max as number) + ") and\n"
                }
              }
              break
            }
          }
        }
      }
    }
    if (criterion instanceof Operation) {
      if (criterion.children.length > 1) {expression += '('}
      criterion.children.forEach((criterionEntity: Operation | Condition) => {
        if (criterionEntity.isEmpty()) {
          // This needs to be catched, because we currently don't block invalid queries
          console.warn(`Detected empty criterion entity ${criterionEntity.key}`)
        } else if (criterionEntity instanceof Operation) {
          expression += '('
          if (criterionEntity.children[0] instanceof Condition) {
            expression += this.getSingleton(criterionEntity.children[0])
          }
          if (criterionEntity.children[0] instanceof Operation) {
            expression += '('
            criterionEntity.children[0].children.forEach((criterionEntityInner: Operation | Condition) => {
              expression += this.getSingleton(criterionEntityInner)
              expression = expression.slice(0, -4) + "or\n"
            })
            expression = expression.slice(0, -4) + ") and\n"
          }
          if (criterionEntity.children[1] instanceof Condition) {
            expression += this.getSingleton(criterionEntity.children[1])
          }
          if (criterionEntity.children[1] instanceof Operation) {
            expression += '('
            criterionEntity.children[1].children.forEach((criterionEntityInner: Operation | Condition) => {
              expression += this.getSingleton(criterionEntityInner)
              expression = expression.slice(0, -4) + "or\n"
            })
            expression = expression.slice(0, -4) + ") and\n"
          }
          expression = expression.slice(0, -5) + ") or\n"
        } else {
          expression += this.getSingleton(criterionEntity).slice(0,-5) + ` ${criterion.operand.toLowerCase()} `
        }
      })
      if (criterion.children.length > 1) {
        expression = expression.slice(0, -4) + ") and\n"
      } else {
        expression = expression.slice(0, -4) + " and\n"
      }
    }
    return expression
  }



  substituteCQLExpression(key: string, alias:string[] | undefined, cql: string, value?: string, min?: number, max?: number): string {
    let cqlString: string
    if (value) {
      cqlString = cql.replace(new RegExp("{{C}}"), value)
    } else {
      cqlString = cql
    }
    cqlString = cqlString.replace(new RegExp("{{K}}"), key)
    if (alias && alias[0]) {
      cqlString = cqlString.replace(new RegExp("{{A1}}", "g"), alias[0])
      const systemExpression = "codesystem " + alias[0] + ": '" + this.alias.get(alias[0]) + "'"
      if (!this.codesystems.includes(systemExpression)) {this.codesystems.push(systemExpression)}
    }
    if (alias && alias[1]) {
      cqlString = cqlString.replace(new RegExp("{{A2}}", "g"), alias[1])
      const systemExpression = "codesystem " + alias[1] + ": '" + this.alias.get(alias[1]) + "'"
      if (!this.codesystems.includes(systemExpression)) {this.codesystems.push(systemExpression)}
    }
    if (min != undefined) {
      cqlString = cqlString.replace(new RegExp("{{D1}}"), min.toString())
    }
    if (max != undefined) {
      cqlString = cqlString.replace(new RegExp("{{D2}}"), max.toString())
    }
    return cqlString
  }



  getCodesystems(): string {
    let codesystems: string = ""
    this.codesystems.forEach((systems) => {
      codesystems += systems + "\n"
    })
    if (codesystems.length > 0) {
      codesystems += "\n"
    }
    return codesystems
  }
}
