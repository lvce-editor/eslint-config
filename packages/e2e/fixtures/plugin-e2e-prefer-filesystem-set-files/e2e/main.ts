export const test = async ({ FileSystem }) => {
  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')
}
