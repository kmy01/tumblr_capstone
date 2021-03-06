const React = require('react');
const PostActions = require('../../actions/post_actions');
const SessionStore = require('../../stores/session_store');

module.exports = React.createClass({
  getInitialState() {
    return {
      body: '',
      mediaFile: '',
      photoUrl: '',
      tags: ''
    };
  },

  _onSubmit(e) {
    e.preventDefault();
    const postData = new FormData();
    postData.append('post[author_id]', SessionStore.currentUser().id);
    postData.append('post[post_type]', 'photo');
    postData.append('post[body]', this.state.body);
    postData.append('post[media_content]', this.state.mediaFile);
    if (!this.state.mediaFile) {
       postData.append('post[photo_url]', this.state.photoUrl);
    }
    postData.append('tags', this.state.tags);

    PostActions.createPost(postData);
    this.setState({
      body: '',
      mediaFile: '',
      photoUrl: '',
      tags: ''
    });
    this.props._closeModal();
  },

  _onBodyChange(e) {
    this.setState({ body: e.target.value });
  },

  _onFileChange(e) {
    let file = e.currentTarget.files[0];
    let fileReader = new FileReader();
    fileReader.onloadend = () => {
      this.setState({
        mediaFile: file,
        photoUrl: fileReader.result
      });

      let height = document.getElementsByClassName('preview')[0].clientHeight;
      if (height > 405) height = 405;
      this.props._changeHeight(241 + height);
    };

    if (file) {
      fileReader.readAsDataURL(file);
    }
  },

  _onUrlChange(e) {
    e.preventDefault();

    let preview = new Image();
    preview.addEventListener("load", () => {
      let height = document.getElementsByClassName('preview')[0].clientHeight;
      if (height > 405) height = 405;
      this.props._changeHeight(241 + height);
    }, false);
    preview.src = e.target.value;

    this.setState({ photoUrl: e.target.value })
  },

  _onTagChange(e) {
    this.setState({ tags: e.target.value })
  },

  _renderPreview() {
    if (this.state.photoUrl) {
      return (
        <img
          className="preview"
          src={this.state.photoUrl} />
      );
    }
  },

  render() {
    return (
      <form className='photo-form'>
        { this._renderPreview() }

        <div className='upload-inputs group'>
          <input
            className='url-input'
            placeholder="Photo Url"
            type='url'
            onChange={this._onUrlChange} />
          <label className='file-input'>
            <input
              type='file'
              onChange={this._onFileChange} />
          </label>
        </div>

        <textarea
          value={this.state.body}
          onChange={this._onBodyChange} />

        <input
          className='tag-input'
          placeholder='#tags'
          value={this.state.tags}
          type='text'
          onChange={this._onTagChange} />

        <div className='form-controls group'>
          <button
            className='form-button post-button'
            onClick={this._onSubmit}>Post</button>
          <button
            className='form-button close-button'
            onClick={this.props._closeModal}>Close</button>
        </div>
      </form>
    );
  }
});
