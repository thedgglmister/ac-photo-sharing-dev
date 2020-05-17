import React from 'react';


class FilterByTagInput extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { setFilterTagId } = this.props;
    setFilterTagId(event.target.value);
  }


  render() {
    const { existingTagsList, filterTagId } = this.props;

    return (
      <div>
        <select value={filterTagId} onChange={this.handleChange}>
          <option value={null}>Filter by Tag</option>
          {existingTagsList.map((tag) =>
            <option key={tag.tagId}
                    value={tag.tagId}>
              {tag.tagName}
            </option>
          )}
        </select>
      </div>
    );
  }
}

export default FilterByTagInput;
