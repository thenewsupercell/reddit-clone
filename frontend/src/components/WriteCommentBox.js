import React from 'react';
import { connect } from 'react-redux';
import {
  Box,
  FormControl,
  FormErrorMessage,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { userSelector, createLoadingAndErrorSelector } from '../selectors';
import { submitComment } from '../actions/comments';

class WriteCommentBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: '',
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { body } = this.state;
    const { postId, parentCommentId, submitComment, onClose } = this.props;
    await submitComment({
      body,
      post_id: postId,
      parent_comment_id: parentCommentId,
    });
    this.setState({ body: '' });
    if (onClose) {
      onClose();
    }
  };

  render() {
    const { body } = this.state;
    const { type = 'comment', isLoading, error, user } = this.props;
    return (
      <Box>
        <form onSubmit={this.handleSubmit}>
          <FormControl mb={3} isInvalid={error}>
            <Textarea
              value={body}
              onChange={(e) =>
                this.setState({
                  body: e.target.value,
                })
              }
              variant="filled"
              isDisabled={!user}
              placeholder="what are your thoughts?"
              rows={5}
            />
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
          <Button isDisabled={!body} isLoading={isLoading} type="submit">
            {type}
          </Button>
        </form>
      </Box>
    );
  }
}

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector(
  ['SUBMIT_COMMENT'],
  false
);

const mapStateToProps = (state) => ({
  isLoading: loadingSelector(state),
  error: errorSelector(state),
  user: userSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  submitComment: (commentDetails) => dispatch(submitComment(commentDetails)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WriteCommentBox);
