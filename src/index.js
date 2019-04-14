import camelcase from 'camelcase'

const camelizeKeys = (obj) => {
  const copy = {}
  for (const key in obj) {
    copy[camelcase(key)] = obj[key]
  }
  return copy
}

const isObject = (data) => typeof data === 'object' && data !== null

const defaultOptions = {
  camleCaseKeys: true,
}

export default class FlatJsonApiNormalizr {
  constructor (options) {
    this.options = {
      ...defaultOptions,
      ...options
    }
    this.error = 'invalid json'
  }

  normalize (json) {

    if (!isObject(json)) {
      console.error(this.error) // eslint-disable-line no-console
      return {}
    }

    const { data = {}, included = [], meta, jsonapi, links, errors } = json

    this.formatedData = {}
    this.includedData = included

    try {
      this.parseData(data)
    } catch (error) {
      console.error(this.error, error) // eslint-disable-line no-console
      return {}
    }

    return {
      jsonapi,
      links,
      errors,
      ...this.formatedData,
      ...meta && { meta: this.options.camleCaseKeys ? camelizeKeys(meta) : meta },
    }
  }

  parseData (data, isRelation) {
    let relationshipsData = {}
    const dataArr = Array.isArray(data) ? data : [data]

    dataArr.forEach(el => {
      const elementType = camelcase(el.type)

      const element = { ...el, ...this.getElementIncluded(el) }

      const formatedElement = {
        ...this.getElementMainData(element),
        ...element.relationships ? { relationships: this.getElementRelationships(element) } : null
      }
      if (isRelation) {
        this.pushDataForRelation(relationshipsData, elementType, element)
      }
      this.addElementToFormatedData(elementType, formatedElement)
    })

    if (isRelation) {
      return relationshipsData
    }
  }

  getElementMainData (el) {
    const { attributes, ...props } = el

    return {
      ...props,
      ...attributes && { attributes: this.options.camleCaseKeys ? camelizeKeys(attributes) : attributes },
    }
  }

  getElementIncluded (el) {
    return this.includedData.find(includedEl => {
      return includedEl.type === el.type && includedEl.id === el.id
    })
  }

  getElementRelationships (el) {
    const { relationships } = el
    if (!relationships) return null

    let formatedData = {}

    for (const relationKey in relationships) {
      const relation = relationships[relationKey].data
      formatedData = { ...formatedData, ...relation ? this.parseData(relation, true) : null }
    }

    return formatedData
  }

  addElementToFormatedData (key, el) {
    if (!this.formatedData[key]) {
      this.formatedData[key] = {}
    }
    this.formatedData[key][el.id] = el
  }

  pushDataForRelation (obj, key, el) {
    const { id, type } = el
    if (!obj[key]) {
      obj[key] = []
    }
    obj[key].push({ id, type })

    return obj
  }
}
