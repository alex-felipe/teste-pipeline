import { faker } from '@faker-js/faker';
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import * as router from "react-router";
import { BrowserRouter } from "react-router-dom";
import * as useFiles from "../../hooks/useFiles";
import { FileListPage } from "../file-list";

const useFilesSpy = jest.spyOn(useFiles, "useFiles");
const useLocationSpy = jest.spyOn(router, "useLocation");

const renderComponent = () => {
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <FileListPage />
            </BrowserRouter>
        </QueryClientProvider>
    )
    return queryClient;
}

const mountFile = () => ({
    id: faker.datatype.uuid(),
    title: faker.name.jobTitle(),
    slug: faker.datatype.uuid(),
    lastUpdated: faker.date.weekday(),
    favorite: false
})

describe('FileList', () => {
    beforeEach(() => {
        useLocationSpy.mockReturnValue({
            pathname: "/",
            state: undefined,
            key: '',
            search: '',
            hash: ''
        });
    })

    it('should render all files', () => {
        const title = faker.name.jobTitle();
        useFilesSpy.mockReturnValue({
            files: [{id: faker.datatype.uuid(),
                title,
                slug: faker.datatype.uuid(),
                lastUpdated: faker.date.weekday(),
                favorite: false}],
            favorites: [],
            isLoading: false,
            isError: false,
        });
        renderComponent();

        expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('should render loading element when isLoading', () => {
        useFilesSpy.mockReturnValue({
            files: [mountFile()],
            favorites: [],
            isLoading: true,
            isError: false,
        });
        renderComponent();

        expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("should show favorites files when is favorite", () => {
        useLocationSpy.mockReturnValue({
            pathname: "/favorites",
            state: undefined,
            key: '',
            search: '',
            hash: ''
        });

        const titleGeneral = faker.name.jobTitle();
        const titleFav = faker.name.jobTitle();
        useFilesSpy.mockReturnValue({
            files: [{
                id: faker.datatype.uuid(),
                title: titleGeneral,
                slug: faker.datatype.uuid(),
                lastUpdated: faker.date.weekday(),
                favorite: false
            }],
            favorites: [{
                id: faker.datatype.uuid(),
                title: titleFav,
                slug: faker.datatype.uuid(),
                lastUpdated: faker.date.weekday(),
                favorite: false
            }],
            isLoading: false,
            isError: false,
        });
        renderComponent();

        expect(screen.getByText(titleFav)).toBeInTheDocument();
        expect(screen.queryByText(titleGeneral)).toBeNull();
    })


})
