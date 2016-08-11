const React = require('react');
const PostActions = require('../../actions/post_actions');
const SessionStore = require('../../stores/session_store');

module.exports = React.createClass({
  getInitialState() {
    return {
      body: '',
      mediaFile: '',
      videoUrl: '',
      tags: ''
    };
  },

  _onSubmit(e) {
    e.preventDefault();
    const postData = new FormData();
    postData.append('post[author_id]', SessionStore.currentUser().id);
    postData.append('post[post_type]', 'video');
    postData.append('post[body]', this.state.body);
    postData.append('post[media_content]', this.state.mediaFile);
    if (!this.state.mediaFile) {
      postData.append('post[video_url]', this.state.videoUrl);
    }
    postData.append('tags', this.state.tags);

    PostActions.createPost(postData);
    this.setState({
      body: '',
      mediaFile: '',
      videoUrl: '',
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
        videoUrl: fileReader.result
      });
    };

    if (file) {
      fileReader.readAsDataURL(file);
    }
    this.props._changeHeight('547px');
  },

  _onUrlChange(e) {
    e.preventDefault();
    this.setState({ videoUrl: e.target.value })
    this.props._changeHeight('547px');
  },

  _onTagChange(e) {
    this.setState({ tags: e.target.value })
  },

  _renderPreview() {
    const videoUrl = this.state.videoUrl;
    let videoRender;

    if (videoUrl.includes('youtube') || videoUrl.includes('vimeo')) {
      videoRender = (
        <iframe
          className='video-preview'
          src={videoUrl}
          frameBorder="0"
          allowFullScreen></iframe>
      );
    } else {
      videoRender = (
        <video
          className='video-preview'
          controls
          src={videoUrl} />
      );
    }

    if (this.state.videoUrl) {
      return videoRender;
    }
  },

  render() {
    return (
      <form className='video-form'>
        { this._renderPreview() }

        <div className='upload-inputs group'>
          <input
            className='url-input'
            placeholder="Video Url"
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
