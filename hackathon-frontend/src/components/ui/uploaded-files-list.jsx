import PropTypes from "prop-types";

const UploadedFilesList = ({ files }) => {
  if (!files.length) return null;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Fichiers uploadés :</h3>
      <ul className="pl-5 list-disc">
        {files.map((file, index) => (
          <li key={index} className="text-sm">
            {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

UploadedFilesList.propTypes = {
  files: PropTypes.array.isRequired,
};

export default UploadedFilesList;
