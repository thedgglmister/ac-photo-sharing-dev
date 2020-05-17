import React from 'react';

const INITIAL_STATE = {
  tagSearchTerm: '',
  focused: false,
};
//TO DO TODO deal with issue of not knowing yo uneed to hit enter to add the pill before it saves. either on save take any non empty string left there and add it as a tag, or make the color light so you feel like its not set yet, or always needs to click (like stackoverflow), and if there are no matches, the current tagSearchTerm is added to the top of the options
class AddTagInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = INITIAL_STATE;

    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTagOptionClick = this.handleTagOptionClick.bind(this);
    this.getTagOptions = this.getTagOptions.bind(this);
  }

  handleBlur(event) {
    const newFocusEl = event.relatedTarget;

    if (newFocusEl && newFocusEl.classList.contains("keepFocus")) {
      return;
    }
    this.setState({
      focused: false,
    });
  }

  handleFocus() {
    this.setState({
      focused: true,
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value.replace(/[^A-Za-z0-9_]/, ''),
    });
  }

  handleTagOptionClick(tag) {
    const { addTag } = this.props;

    addTag(tag);
    this.setState({
      ...INITIAL_STATE,
    });
  }

  getTagOptions(limit) {
    const { tagSearchTerm } = this.state;
    const { tagsList, existingTagsList } = this.props;
    const lc_tagSearchTerm = tagSearchTerm.toLowerCase();

    const tagOptions = [];
    for (let tag of existingTagsList) {
      if (tag.lc_tagName == lc_tagSearchTerm) {
        tagOptions.unshift(tag);
      }
      else if (tag.lc_tagName.includes(lc_tagSearchTerm)) {
        tagOptions.push(tag);
      }
    }
    if (lc_tagSearchTerm && (tagOptions.length == 0 || (tagOptions.length > 0 && tagOptions[0].lc_tagName != lc_tagSearchTerm))) {
      tagOptions.unshift({
        tagName: tagSearchTerm,
        lc_tagName: lc_tagSearchTerm,
      });
    }

    const tagNamesAlreadyAdded = tagsList.map(tag => tag.lc_tagName);

    return tagOptions.filter(tag => !tagNamesAlreadyAdded.includes(tag.lc_tagName)).slice(0, limit);
  }




  render() {
    const { tagSearchTerm, focused } = this.state;
    const { tagsList, existingTagsList } = this.props;
    const tagOptions = focused ? this.getTagOptions(5) : null;

    const matchStyle = {
      border: '1px solid black',
      padding: '5px',
      cursor: 'pointer',
    };

    const matchesStyle = {
      border: '1px solid black',
      backgroundColor: '#fff',
      display: 'inline-block',
      position: 'absolute',
      verticalAlign: 'top',
    };


    //TODO TO DO handle no matches better, if no existing and searchterm is already added, then it will be empty.
    return (
      <div>
        <input type="text" name="tagSearchTerm" placeholder="Add Tag" value={tagSearchTerm} onChange={this.handleChange} onBlur={this.handleBlur} onFocus={this.handleFocus} onKeyUp={this.handleKeyUp} autocomplete="off" />
        {focused &&
          <div style={matchesStyle}>
            {tagOptions.map((tag) =>
              <div key={tag.tagName}
                    style={matchStyle}
                    tabindex="-1"
                    className="keepFocus"
                    onClick={() => this.handleTagOptionClick(tag)}
                    >
                {`#${tag.tagName}`}
              </div>
            )}
          </div>
        }
      </div>
    );
  }
}

export default AddTagInput;
