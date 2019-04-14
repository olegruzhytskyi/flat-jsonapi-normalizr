# flat-jsonapi-normalizr

Utility to normalize JSON API response

# Options

| Name | default value |
| --- | --- |
| camleCaseKeys | true |

```JavaScript
new FlatJsonApiNormalizr({
  camleCaseKeys: false
})
```

# Example

```JavaScript
import FlatJsonApiNormalizr from 'flat-jsonapi-normalizr'

const normalizr = new FlatJsonApiNormalizr()

normalizr.normalize(JSON.parse(jsonStr))
```

### Input

```json
{
  "links": {
    "self": "http://example.com/articles",
    "next": "http://example.com/articles?page[offset]=2",
    "last": "http://example.com/articles?page[offset]=10"
  },
  "data": [
    {
      "type": "articles",
      "id": "1",
      "attributes": {
        "title": "JSON API paints my bikeshed!"
      },
      "relationships": {
        "author": {
          "links": {
            "self": "http://example.com/articles/1/relationships/author",
            "related": "http://example.com/articles/1/author"
          },
          "data": {
            "type": "people",
            "id": "9"
          }
        },
        "comments": {
          "links": {
            "self": "http://example.com/articles/1/relationships/comments",
            "related": "http://example.com/articles/1/comments"
          },
          "data": [
            {
              "type": "comments",
              "id": "5"
            },
            {
              "type": "comments",
              "id": "12"
            }
          ]
        }
      },
      "links": {
        "self": "http://example.com/articles/1"
      }
    }
  ],
  "included": [
    {
      "type": "people",
      "id": "9",
      "attributes": {
        "first-name": "Dan",
        "last-name": "Gebhardt",
        "twitter": "dgeb"
      },
      "links": {
        "self": "http://example.com/people/9"
      }
    },
    {
      "type": "comments",
      "id": "5",
      "attributes": {
        "body": "First!"
      },
      "relationships": {
        "author": {
          "data": {
            "type": "people",
            "id": "2"
          }
        }
      },
      "links": {
        "self": "http://example.com/comments/5"
      }
    },
    {
      "type": "comments",
      "id": "12",
      "attributes": {
        "body": "I like XML better"
      },
      "relationships": {
        "author": {
          "data": {
            "type": "people",
            "id": "9"
          }
        }
      },
      "links": {
        "self": "http://example.com/comments/12"
      }
    }
  ]
}
```

### Output

```json
{
  "links":{
    "self":"http://example.com/articles",
    "next":"http://example.com/articles?page[offset]=2",
    "last":"http://example.com/articles?page[offset]=10"
  },
  "people":{
    "2":{
      "type":"people",
      "id":"2"
    },
    "9":{
      "type":"people",
      "id":"9",
      "links":{
        "self":"http://example.com/people/9"
      },
      "attributes":{
        "firstName":"Dan",
        "lastName":"Gebhardt",
        "twitter":"dgeb"
      }
    }
  },
  "comments":{
    "5":{
      "type":"comments",
      "id":"5",
      "relationships":{
        "people":[
          {
            "id":"2",
            "type":"people"
          }
        ]
      },
      "links":{
        "self":"http://example.com/comments/5"
      },
      "attributes":{
        "body":"First!"
      }
    },
    "12":{
      "type":"comments",
      "id":"12",
      "relationships":{
        "people":[
          {
            "id":"9",
            "type":"people"
          }
        ]
      },
      "links":{
        "self":"http://example.com/comments/12"
      },
      "attributes":{
        "body":"I like XML better"
      }
    }
  },
  "articles":{
    "1":{
      "type":"articles",
      "id":"1",
      "relationships":{
        "people":[
          {
            "id":"9",
            "type":"people"
          }
        ],
        "comments":[
          {
            "id":"5",
            "type":"comments"
          },
          {
            "id":"12",
            "type":"comments"
          }
        ]
      },
      "links":{
        "self":"http://example.com/articles/1"
      },
      "attributes":{
        "title":"JSON API paints my bikeshed!"
      }
    }
  }
}
```
