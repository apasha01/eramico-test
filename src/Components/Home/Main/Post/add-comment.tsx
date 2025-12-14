import { Button, TextField } from "@mui/material";

interface AddCommentProps {
  onClose: any;
  onChange: any;
  onSubmit: any;
  loading: boolean;
  commentBody: string;
}

const AddComment = ({
  onClose,
  onChange,
  onSubmit,
  loading,
  commentBody,
}: AddCommentProps) => {
  return (
    <div className="BorderBottom w-100">
      <TextField
        className="commentTextFiled my-3"
        variant="outlined"
        required
        placeholder=" متن نظر "
        autoComplete="off"
        multiline
        rows={5}
        name="Body"
        value={commentBody}
        onChange={onChange}
      />
      <div className="d-flex gap-2 justify-between">
        <Button
          variant="contained"
          size="small"
          style={{
            height: " 52px",
            borderRadius: "12px",
            width: "160px",
            marginBottom: "32px",
            marginTop: "136px",
            display: "flex",
          }}
          type="submit"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "در حال ارسال..." : "ارسال"}
        </Button>

        <Button
          variant="outlined"
          size="small"
          style={{
            height: " 52px",
            borderRadius: "12px",
            width: "160px",
            marginBottom: "32px",
            marginTop: "136px",
            display: "flex",
          }}
          onClick={onClose}
        >
          لغو
        </Button>
      </div>
    </div>
  );
};

export default AddComment;
