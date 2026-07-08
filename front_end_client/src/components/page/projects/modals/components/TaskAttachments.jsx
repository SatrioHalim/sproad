import {
  Article,
  Check,
  Close,
  Delete,
  Image,
  PictureAsPdf,
} from '@mui/icons-material';
import {
  Box,
  Button,
  colors,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useWatch } from 'react-hook-form';

import useTaskAttachments from '../hooks/useTaskAttachments';

import Upload from '@/components/ui/forms/upload';
import { getFileExtension, getFileName } from '@/utils/attachment';
import { API_BASE_URL } from '@/utils/network';

const TaskAttachments = () => {
  const {
    taskDetailData,
    formTaskAttachment,
    isShowConfirmDeleteTaskAttachment,
    setShowConfirmDeleteTaskAttachment,
    isLoading,
    onSubmitTaskAttachment,
    onDeleteTaskAttachment,
  } = useTaskAttachments();

  const selectedAttachments = useWatch({
    control: formTaskAttachment.control,
    name: 'attachments',
  });

  const normalizedSelectedAttachments = Array.isArray(selectedAttachments)
    ? selectedAttachments
    : [];

  const removeSelectedAttachment = (indexToRemove) => {
    const nextAttachments = normalizedSelectedAttachments.filter(
      (_, index) => index !== indexToRemove,
    );
    formTaskAttachment.setValue('attachments', nextAttachments, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const renderIcon = (fileUrl) => {
    const extension = getFileExtension(fileUrl);
    if (/png/.test(extension)) return <Image />;
    if (/pdf/.test(extension)) return <PictureAsPdf />;
    return <Article />;
  };

  const getAttachmentUrl = (item) => item?.file_url || item?.file || '';

  const getAttachmentLabel = (item) => {
    const url = getAttachmentUrl(item);
    return url ? getFileName(url) : 'Unknown file';
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Lampiran (Attachment)
      </Typography>
      {normalizedSelectedAttachments.length > 0 ? (
        <Stack sx={{ gap: 1 }}>
          <Typography variant="body2" sx={{ color: colors.grey[600] }}>
            File yang dipilih
          </Typography>
          {normalizedSelectedAttachments.map((item, index) => (
            <Stack
              key={`${item?.name || 'attachment'}-${index}`}
              direction="row"
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                border: `1px solid ${colors.grey[200]}`,
                borderRadius: 1,
                px: 1.5,
                py: 1,
                backgroundColor: colors.grey[50],
              }}
            >
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                <Article fontSize="small" />
                <Typography variant="body2">
                  {item?.name || item?.file_name || 'Untitled file'}
                </Typography>
              </Stack>
              <Button
                type="button"
                variant="text"
                size="small"
                onClick={() => removeSelectedAttachment(index)}
              >
                Remove
              </Button>
            </Stack>
          ))}
        </Stack>
      ) : null}
      <Stack sx={{ gap: 2 }}>
        {taskDetailData?.attachments?.map((item, index) => (
          <Stack
            key={item?.public_id || `${getAttachmentLabel(item)}-${index}`}
            direction={'row'}
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              border: `1px solid ${colors.grey[300]}`,
              height: 80,
              borderRadius: 1,
              p: 1,
            }}
          >
            <Stack
              direction={'row'}
              sx={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {renderIcon(getAttachmentUrl(item))}
              <Typography
                variant="body2"
                component={'a'}
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: colors.blue[700],
                  fontWeight: 600,
                  ':hover': {
                    color: colors.blue[900],
                    textDecoration: 'underline',
                  },
                }}
                href={
                  item?.file_url ||
                  (getAttachmentUrl(item)
                    ? `${API_BASE_URL}/files/${getFileName(getAttachmentUrl(item))}`
                    : '#')
                }
                target="_blank"
                rel="noreferrer"
              >
                {getAttachmentLabel(item)}
              </Typography>
            </Stack>
            <Box>
              {isShowConfirmDeleteTaskAttachment.show &&
              isShowConfirmDeleteTaskAttachment?.item?.public_id ==
                item.public_id ? (
                <Stack direction={'row'} sx={{ gap: 1 }}>
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => onDeleteTaskAttachment(item.public_id)}
                  >
                    <Check />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setShowConfirmDeleteTaskAttachment({
                        show: false,
                        item: null,
                      });
                    }}
                  >
                    <Close />
                  </IconButton>
                </Stack>
              ) : (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    setShowConfirmDeleteTaskAttachment({
                      show: true,
                      item,
                    });
                  }}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          </Stack>
        ))}
      </Stack>
      <Stack
        sx={{
          gap: 1,
        }}
        component={'form'}
        onSubmit={formTaskAttachment.handleSubmit(onSubmitTaskAttachment)}
      >
        <Upload
          control={formTaskAttachment.control}
          name={'attachments'}
          accept=".pdf, .jpg, .png"
          multiple
        />
        <Stack
          direction={'row'}
          sx={{
            justifyContent: 'flex-end',
            gap: 1,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            loading={isLoading}
            size="small"
          >
            Save
          </Button>
          <Button
            type="button"
            variant="outlined"
            disabled={isLoading}
            size="small"
            onClick={() =>
              formTaskAttachment.reset({
                attachments: [],
              })
            }
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TaskAttachments;
