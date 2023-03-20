import Auth from '@/components/auth';
import Container from '@/components/container';
import { HMenu, MenuItem } from '@/components/menu';
import PaginationC from '@/components/pagination';
import SearchBar from '@/components/search';
import Table from '@/components/table';
import Tooltip from '@/components/tooltip';
import { useFuzzers } from '@/hook/fuzzer/fuzzers';
import { useModal } from '@/hook/global';
import { Request as HarRequest } from '@/model/har';
import { rawRequestToHar } from '@/utils/zap/har';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { BiWindowOpen } from 'react-icons/bi';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { HiPlus } from 'react-icons/hi';




const Index: NextPage<{ csrfToken: string }> = ({ csrfToken }) => {

  const { isOpen, set } = useModal();
  const { push } = useRouter();
  const { status } = useSession();

  const { onSearch, setSearch, search, pagination, next, prec, fuzzers, onSelect, selectedItems, onUpdate, onCreate, onRemove } = useFuzzers();


  if (status === "unauthenticated" || status === "loading") {
    return (
      <Container>
        <Auth />
      </Container>
    );
  }
  return (
    <Container>
      <div className='flex flex-row justify-center w-full h-full'>
        <div className='flex flex-col gap-4 items-start mt-10 w-[90%] bg-red-'>
          <div className='flex flex-row gap-2 justify-between w-full'>
            <SearchBar className='bg-base-300 focus-within:bg-base-300'>
              <SearchBar.Button className='bg-base-300' onClick={onSearch}/>
              <SearchBar.Input className='bg-base-300' value={search} onChange={({ currentTarget: { value } }) => setSearch(value)} />
            </SearchBar>
            <HMenu>
              <MenuItem tooltip='create' onClick={onCreate}><HiPlus /></MenuItem>
              <MenuItem
                tooltip='edit'
                className={`${selectedItems.length > 1 ? "btn-disabled" : ""}`}
                onClick={() => onUpdate(selectedItems[0])}>
                <FiEdit2 />
              </MenuItem>
              <MenuItem tooltip='remove' onClick={onRemove} ><FiTrash2 /></MenuItem>
            </HMenu>
          </div>
          <div className='max-h-[30rem] min-h-[15rem] w-full'>
            <Table className='w-full shadow-xl rounded-2xl '>
              <thead>
                <tr>
                  <td><input
                    type={"checkbox"}
                    className="checkbox"
                    onChange={({ currentTarget: { checked } }) => onSelect(checked, "all")}
                    checked={selectedItems.includes("all")} />
                  </td>
                  <th>#</th>
                  <th>name</th>
                  <th>injections</th>
                  <th>url</th>
                  <th>created</th>
                  <th>updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {fuzzers.data?.map(({ id, injections, name, rawRequest, createdAt, updatedAt }, idx) => {

                  let har: HarRequest | null = null;
                  if (rawRequest) {
                    har = rawRequestToHar(rawRequest);
                  }

                  return (
                    <tr className='hover' key={idx}>
                      <td><input type={"checkbox"} checked={selectedItems.includes(name)} className="checkbox" onChange={({ currentTarget: { checked } }) => onSelect(checked, name)} /></td>
                      <td>{idx}</td>
                      <td>{name}</td>
                      <td>{injections.length}</td>
                      <td>{har?.url ?? "#"}</td>
                      <td>{new Date(createdAt).toLocaleString()}</td>
                      <td>{new Date(updatedAt).toLocaleString()}</td>
                      <td>
                        <Tooltip content="open fuzzer">
                          <button onClick={() => push(`/fuzzer/${name}`)} className='btn btn-ghost rounded-2xl'><BiWindowOpen /></button>
                        </Tooltip>
                      </td>
                    </tr>
                  )
                })
                }
              </tbody>
            </Table>
          </div>
          <PaginationC pagination={pagination} nextPage={next} precPage={prec} />
        </div>
      </div>
    </Container>
  );

}

export default Index;