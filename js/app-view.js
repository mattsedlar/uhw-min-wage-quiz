app.QuestionView = Backbone.View.extend({
  el: '#question-container',
  template: _.template( $("#question_template").html()),
  render: function() {
    this.$el.html( this.template(this.model.toJSON()));
    return this;
  }
});
