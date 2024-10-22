var peliasQuery = require('pelias-query'),
  ngrams_strict = require('./ngrams_strict'),
  ngrams_fuzzy = require('./ngrams_fuzzy');
/**
  Ngrams view which trims the 'input:name' and only uses the LAST TOKEN.

  eg. if the input was "100 foo str", then 'input:name' would only be 'str'
  note: it is assumed that the rest of the input is matched using another view.

  code notes: this view makes a copy of the $vs object in order to change their
  values without mutating the original values, which may be expected in their
  unaltered form by other views.
**/

module.exports = function (vs, score_only) {
  // get a copy of the *tokens_incomplete* tokens produced from the input:name
  var tokens = vs.var('input:name:tokens_incomplete').get();

  // no valid tokens to use, fail now, don't render this view.
  if (!tokens || tokens.length < 1) { return null; }

  // make a copy Vars so we don't mutate the original
  var vsCopy = new peliasQuery.Vars(vs.export());

  // set the 'name' variable in the copy to only the last token
  vsCopy.var('input:name').set(tokens.join(' '));

  const fuzziness = vs.var('fuzzy:fuzziness').get();

  var query = fuzziness === 0 ? ngrams_strict(vsCopy) : ngrams_fuzzy(vsCopy);

  // 17 or 18 seems to be the best (testing on Paristan)
  const boost = score_only ? 17 : 1.0;
  // return the view rendered using the copy
  return {
    'constant_score': {
      'filter': query,
      'boost': boost
    }
  };
};
